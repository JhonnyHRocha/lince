<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 08/10/15
 * Time: 20:48
 */

namespace Lince\Presenters;
use Lince\Transformers\RevendedoresTransformer;
use Prettus\Repository\Presenter\FractalPresenter;

class RevendedoresPresenter extends FractalPresenter
{
    public function getTransformer(){
        return new RevendedoresTransformer();
    }
}