import { Direction } from '../direction';
import { newScore, newLabel } from '../../utils';
import { execute, comment as $, MCFunction, _ } from 'sandstone';

const scale = (x: number) => x*1000;

export default function (input: Direction) {

  const calculate = [ newScore('_calc0'), newScore('_calc1') ],
        absolute_rotation = input.absolute.rotation,
        vec_x = input.absolute.vector.X,
        vec_z = input.absolute.vector.Z;

  const math = MCFunction('_wasd/math', () => {
    $('# Get Rotation');
    execute.store.result.score(absolute_rotation).run.
      data.get.entity('@s', 'Rotation[0]', 1000);

    _.if(absolute_rotation.matches([null, 0]), () => { absolute_rotation.add(scale(360)) })

    const negate = newLabel('_negate');

    $('# Calculate rotation vector');

    calculate[0].set(absolute_rotation);

    const sine = () => {
      $("Calculate sine using Bhaskara I's approx.");

      _.if(calculate[0].greaterOrEqualThan(scale(180)), () => { negate.add() });

      _.if(negate, () => { calculate[0].remove(scale(180)) });

      calculate[1].set(scale(180))
                  .remove(calculate[0]).divide(1000)
                  .multiply(calculate[0]);

      calculate[0].set(scale(40500))
                  .remove(calculate[1]);

      calculate[1].multiply(4);
      calculate[0].divide(1000);
      calculate[1].divide(calculate[0]);

      _.if(negate, () => { calculate[1].multiply(-1) });

      negate.remove();
    }
    
    sine();
    
    $('');

    const dxrot = calculate[0].objective.ScoreHolder('dxrot'),
          dzrot = calculate[0].objective.ScoreHolder('dzrot');

    dxrot.set(calculate[1]);

    dxrot.multiply(-1);

    calculate[0].set(absolute_rotation);

    $('');
    $('Calculate cosine ~ `cos(x)=sin(x+90)`')
    calculate[0].add(scale(90))
    sine();

    $('');

    dzrot.set(calculate[1]);

    const temp = [ calculate[0].objective.ScoreHolder('temp0'), calculate[0].objective.ScoreHolder('temp1') ];

    $('# Calculate dot product');
    calculate[0].set(vec_z);
    temp[0].set(vec_x);

    calculate[0].multiply(dxrot);
    temp[0].multiply(dzrot);
    calculate[0].remove(temp[0]);

    calculate[0].multiply(10);
    _.if(calculate[0].lessOrEqualThan(-1), () => { negate.add() });

    $('# Calculate determinant')
    calculate[1].set(vec_x);
    temp[0].set(vec_z);

    calculate[1].multiply(dxrot);
    temp[0].multiply(dzrot);
    calculate[1].add(temp[0]);

    $('');

    _.if(calculate[1].greaterOrEqualThan(1), () => input.forward.add() )

    .elseIf(calculate[1].lessOrEqualThan(-1), () => input.backward.add() );

    $('# Calculate Local Rotation')
    $('Calculate arc tangent (atan2)')
    calculate[0].divide(calculate[1])

    const flip = newLabel('_flip');
    _.if(calculate[0].lessOrEqualThan(-1), () => flip.add() );

    _.if(flip, () => { calculate[0].multiply(-1) });

    const invert = newLabel('_invert');
    _.if(calculate[0].greaterOrEqualThan(11), () => invert.add() );

    _.if(invert, () => {
      calculate[1].set(calculate[0]);

      calculate[0].set(100).divide(calculate[1]);
    });

    temp[0].set(calculate[0]).remove(10);

    temp[1].set(calculate[0]).divide(100).multiply(383).add(140).divide(100);

    temp[0].multiply(temp[1]);

    temp[1].set(450)
          .remove(temp[0]).divide(10);

    calculate[0].multiply(temp[1]);

    _.if(invert, () => {
      calculate[1].set(calculate[0]);

      calculate[0].set(900)
                  .remove(calculate[1]);
    })

    _.if(flip, () => {
      calculate[1].set(calculate[0]);

      calculate[0].set(1800)
                  .remove(calculate[1]);
    })

    _.if(negate, () => {
      calculate[1].set(calculate[0]);

      calculate[0].set(1800)
                  .remove(calculate[1]).multiply(-1);
    })

    _.if(_.and(calculate[0].equalTo(-1800), input.forward), () => { calculate[0].set(0) });

    _.if(_.and(calculate[0].equalTo(0), input.backward), () => { calculate[0].set(1800) });

    flip.remove();
    invert.remove();
    negate.remove();
    input.forward.remove();
    input.backward.remove();
    $('');
    $('atan2 approximation');
    $('atan2(x) = x(45-(x-1)(14+3.83x))');
    $('atan2(1000x) = (1000x(45000-((1000x-1000)(14000+3.83*1000x))/1000))/1000/1000');
    $('atan2(-x) = -atan2(x)');
    $('x>1 atan2(x) = 90-atan2(1/x)');
    $('atan2(det/dot)');
  });

  math();
  
  return calculate[0];
}