<?php
class Result implements JsonSerializable
{

    private $type;
    private $data;
    private $responseCode;

    function __construct($type, $data, $responseCode)
    {
        $this->type = $type;
        $this->data = $data;
        $this->responseCode = $responseCode;
    }

    public function jsonSerialize()
    {
        http_response_code($this->responseCode);
        $result = [
            'type' => $this->type,
            'data' => $this->data,
        ];
        return $result;
    }
}
