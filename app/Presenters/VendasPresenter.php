<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 08/10/15
 * Time: 20:48
 */

namespace Lince\Presenters;
use Lince\Transformers\VendasTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

class VendasPresenter extends FractalPresenter
{
    public function getTransformer(){
        return new VendasTransformer();
    }
}