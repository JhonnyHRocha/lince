<?php

require_once '../../../../vendor/autoload.php';

use JansenFelipe\CnpjGratis\CnpjGratis;
use Goutte\Client;

$telefone = $_GET['tel'];
$url = 'http://www.qualoperadora-consulta.com/content_data.php';
$fields = array(
    'tel' => $telefone
);

//url-ify the data for the POST
foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
rtrim($fields_string, '&');

//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
curl_setopt($ch,CURLOPT_HEADER, 0);

//execute post
$result = curl_exec($ch);

//close connection
curl_close($ch);

?>