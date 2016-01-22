<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 08/10/15
 * Time: 20:48
 */

namespace Lince\Presenters;
use Lince\Transformers\ClienteTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

class ClientePresenter extends FractalPresenter
{
    public function getTransformer(){
        return new ClienteTransformer();
    }
}