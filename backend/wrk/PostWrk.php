<?php


class PostWrk
{
    private $trackingNumber = "";
    private $trackingNumberHash = "";
    private $trackingNumberIdentity = "";
    private $events = [];

    private $userId = "";
    private $cookie = "";
    private $csrfToken = "";

    public function getEventsFromTrackingNumber($trackingNumber)
    {
        $this->trackingNumber = $trackingNumber;
        
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

        $response = json_decode(curl_exec($curl), true)[0];
        $this->trackingNumberIdentity = $response["identity"];

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

        $this->events = curl_exec($curl);
        curl_close($curl);
    }
}
