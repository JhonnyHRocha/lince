<?php

namespace Lince\Http\Controllers;

use DateTime;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Lince\Entities\Cliente;
use Lince\Entities\Vendas;
use Lince\Http\Requests;
use Lince\Http\Controllers\Controller;
use OpenBoleto\Banco\BancoDoBrasil;
use OpenBoleto\Agente;
use JansenFelipe\Utils\Utils as Utils;
use JansenFelipe\Utils\Mask as Mask;
use OpenBoleto\Dias_uteis;

/**
 * @property  load
 */
class BoletoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $venda = Vendas::where('id',$id)->get();
        $cliente = Cliente::where('id',$venda[0]['id_cliente'])->get();
        $valor_boleto = '3.5';
        $boleto = DB::table('boleto')->where('id_venda','=',$id)->first();
        if (!$boleto) {
            $idboleto = DB::table('boleto')->insertGetId([
                'id_venda' => $id
            ]);
        } else {
            $idboleto = $boleto->id;
        }
        //$cliente = Clientes::model()->find('id=:id',array(':id'=>$venda['idcliente']));

        $texto_cpf = '';
        if (preg_match("/[0-9]{14}/",$cliente[0]['cpf_cnpj'])) {
            $cpf = Utils::mask($cliente[0]['cpf_cnpj'], Mask::CNPJ);
            $texto_cpf = "CNPJ: $cpf";
        }


        $nome=trim(strtoupper($cliente[0]["nome"]));
        $cpf= $texto_cpf;
        $endereco=trim(strtoupper($cliente[0]['logradouro']. " " . $cliente[0]['complemento'] . " " . $cliente[0]['bairro']));
        $cep = str_replace(array('.','-'),'',$cliente[0]['cep']);
        $cep=Utils::mask($cep, "#####-###");
        $cidade=strtoupper(Utils::unaccents($cliente[0]['cidade']));
        $uf=$cliente[0]['uf'];
        $valor=floatval($venda[0]['valor'])+floatval($valor_boleto);
        $dia_util = new Dias_uteis();
        $data=$dia_util->Somadiasuteis(date('d/m/Y'), 1,'us');
        $documento=str_pad($idboleto,'0',STR_PAD_LEFT);

        $sacado = new Agente($nome, $cpf, $endereco, $cep, $cidade, $uf);
        $cedente = new Agente('CERBERUS TEC LTDA', '22.922.698/0001-35', 'RUA TEODORO LUIS DE CASTRO, 609 LJ 02', '94510-500', 'VIAMÃO', 'RS');

        $boleto = new BancoDoBrasil(array(
            // Parâmetros obrigatórios
            'dataVencimento' => new DateTime($data),
            'valor' => $valor,
            'sequencial' => $documento, // Para gerar o nosso número
            'sacado' => $sacado,
            'cedente' => $cedente,
            'agencia' => '5653', // Até 4 dígitos
            'carteira' => '17',
            'conta' => '37080-0', // Até 8 dígitos
            'convenio' => '2769746', // 4, 6 ou 7 dígitos
            'NumeroDocumento'=>$documento,
        ));

        $dados['boleto'] = $boleto->getOutput();
        return $dados['boleto'];
        //return view('boleto.boleto', $dados);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
