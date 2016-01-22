<?php

define('NEWLINE', "<br />\n");

// SOAP client

$wsdl = 'http://85.25.43.120:8000/Filtro.svc?wsdl';

$soapClient = new SoapClient($wsdl, array('cache_wsdl' => 0, 'user_agent' => "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:43.0) Gecko/20100101 Firefox/43.0"));

// SOAP call

$parameters->jid = $_GET['number'];


try
{
    $result = $soapClient->GetDataUsingDataContract($parameters);
}
catch (SoapFault $fault)
{
    echo "Fault code: {$fault->faultcode}" . NEWLINE;
    echo "Fault string: {$fault->faultstring}" . NEWLINE;
    if ($soapClient != null)
    {
        $soapClient = null;
    }
    exit();
}
$soapClient = null;

//echo "<pre>\n";
//print_r($result);
//echo "</pre>\n";

$class = $result->GetDataUsingDataContractResult;

//$src = "data:image/png;base64," . $class->Image;

//echo "<img src='$src' alt='Base64 encoded image' width='$class->Width' height='$class->Height'/>";

//echo NEWLINE;
echo "Result: " . $class->Status;// .NEWLINE; // possibilidades yes= tem whatsapp no= não tem timeout= tempo estourado canal bloqueado = canal bloqueado
//echo "Image Width: " . $class->Width .NEWLINE; // largura da imagem
//echo "Image Height: " . $class->Height .NEWLINE; // altura da imagem
// $class->Image = imagem base64 (jpg)


?>