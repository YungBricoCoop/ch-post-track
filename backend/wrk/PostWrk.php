<?php


class PostWrk
{
    private $trackingNumber = "";
    private $trackingNumberHash = "";
    private $trackingNumberIdentity = "";
    private $events = [];

    private $language = "";
    private $translations = [];
    private $userId = "";
    private $cookie = "";
    private $csrfToken = "";

    public function getEventsFromTrackingNumber($trackingNumber, $language = "en")
    {
        $this->trackingNumber = $trackingNumber;
        $this->language = strtolower($language);

        $this->loadTranslations();
        $this->getUser();
        $this->getTrackingNumberHash();
        $this->getTrackingNumberIdentity();
        $this->getEvents();

        return $this->events;
    }


    private function getUser()
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://service.post.ch/ekp-web/api/user',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_HEADER => 1,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => array(),
        ));

        $response = curl_exec($curl);

        //Process headers
        $header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
        $headers = substr($response, 0, $header_size);
        $this->getSessionCookieAndCsrfToken($headers);

        //Process body
        $body = substr($response, $header_size);
        $response = json_decode($body, true);
        $this->userId = urlencode($response["userIdentifier"]);

        curl_close($curl);
    }

    private function getSessionCookieAndCsrfToken($headers)
    {
        $sessionCookie = "";
        $csrfToken = "";
        foreach (explode("\r\n", $headers) as $header) {
            if (strpos($header, 'Set-Cookie:') === 0) {
                $sessionCookie = substr($header, 12);
            }
            if (strpos($header, 'X-CSRF-TOKEN:') === 0) {
                $csrfToken = substr($header, 14);
            }
        };
        $this->cookie = $sessionCookie;
        $this->csrfToken = $csrfToken;
    }

    private function getTrackingNumberHash()
    {
        $postData = array("searchQuery" => $this->trackingNumber);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://service.post.ch/ekp-web/api/history?userId=' . urlencode($this->userId),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => json_encode($postData),
            CURLOPT_HTTPHEADER => array(
                'x-csrf-token: ' . $this->csrfToken,
                'Content-Type: application/json',
                'Cookie: ' . $this->cookie,
            ),
        ));

        $response = json_decode(curl_exec($curl), true);
        $this->trackingNumberHash = $response["hash"];

        curl_close($curl);
    }

    private function getTrackingNumberIdentity()
    {
        $curl = curl_init();

        $url = 'https://service.post.ch/ekp-web/api/history/not-included/' . $this->trackingNumberHash . '?userId=' . urlencode($this->userId);
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => array(
                'x-csrf-token: ' . $this->csrfToken,
                'Content-Type: application/json',
                'Cookie: ' . $this->cookie,
            ),
        ));

        $response = json_decode(curl_exec($curl), true);
        if (count($response) > 0) {
            $response = $response[0];
            $this->trackingNumberIdentity = $response["identity"];
        }

        curl_close($curl);
    }

    private function getEvents()
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://service.post.ch/ekp-web/api/shipment/id/' . $this->trackingNumberIdentity . '/events/',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => array(
                'x-csrf-token: ' . $this->csrfToken,
                'Content-Type: application/json',
                'Cookie: ' . $this->cookie,
            ),
        ));
        $events = curl_exec($curl);
        $events = json_decode($events, true);
        if (json_last_error() === JSON_ERROR_NONE) {

            usort($events, function ($a, $b) {
                return strtotime($a['timestamp']) - strtotime($b['timestamp']);
            });
            foreach ($events as &$event) {
                $event["eventName"] = $this->translate($event["eventCode"]);
                $event["timestamp"] = date("d.m.Y (H:i)", strtotime($event["timestamp"]));
            }

            $this->events = array_reverse($events);
        }
        curl_close($curl);
    }

    private function loadTranslations()
    {
        $file = file_get_contents("../data/shipment-text-messages-" . $this->language . ".json");
        $translations = json_decode($file, true);
        $this->translations = array_merge($translations["additional-services-text--"], $translations["shipment-text--"], $translations["country-text--"]);
    }

    private function translate($key)
    {
        $keys = explode(".", $key);
        $result = "";
        foreach ($this->translations as $translation => $value) {
            $tKeys = explode(".", $translation);
            $test = true;
            $i = 0;
            foreach ($keys as $key) {
                if ((count($tKeys) - 1 >= $i) && ($key != "*" && $tKeys[$i] != "*") && ($key != $tKeys[$i])) {
                    $test = false;
                }
                $i++;
            }
            if ($test) {
                $result =  $value;
            }
        }
        return $result;
    }
}
