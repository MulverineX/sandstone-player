import { execute, Objective, _, comment as $ } from 'sandstone';
import { Direction } from '../direction';

export default function (input: Direction) {
   $('Get Rotation');
    execute.store.result.score(input.absolute.rotation).run.
      data.get.entity('@s', 'Rotation[0]', 1000);

   $('');
   $('Define values');

   // scoreboard players operation #math_01 value = @s x
   // scoreboard players operation #math_02 value = @s z
   // scoreboard players operation #math_01 value -= @s x_previous
   // scoreboard players operation #math_02 value -= @s z_previous
   const vec_x = input.absolute.vector.X,
         vec_z = input.absolute.vector.Z,
         math = Objective.create('wasd._calc'),
         calc = {
            // scoreboard players operation #math_03 value = #math_01 value
            // scoreboard players operation #math_04 value = #math_02 value
            x: math('#x').set(vec_x),
            z: math('#z').set(vec_z),
            // scoreboard players set #math_06 value 0
            // scoreboard players set #math_07 value 0
            // scoreboard players set #math_08 value 0
            // scoreboard players set #math_09 value 0
            a: math('#a').set(0),
            b: math('#b').set(0),
            c: math('#c').set(0),
            d: math('#d').set(0),
            e: math('#e').set(0),
         };

   // execute if score #math_03 value matches ..-1 run scoreboard players operation #math_03 value *= #-1 value
   _.if(calc.x.matches([ null, -1 ]), () => { calc.x.multiply(-1) });
   // execute if score #math_04 value matches ..-1 run scoreboard players operation #math_04 value *= #-1 value
   _.if(calc.z.matches([ null, -1 ]), () => { calc.z.multiply(-1) });
   // execute if score #math_03 value < #math_04 value run scoreboard players operation #math_05 value = #math_03 value
   // execute if score #math_03 value >= #math_04 value run scoreboard players operation #math_05 value = #math_04 value
   _.if(calc.x.lessThan(calc.z), () => { calc.a.set(calc.x)})
   .else(() => { calc.a.set(calc.z) });
   // scoreboard players operation #math_05 value *= #1000 value
   calc.a.multiply(1000);
   // execute if score #math_03 value > #math_04 value run scoreboard players operation #math_05 value /= #math_03 value
   // execute if score #math_03 value <= #math_04 value run scoreboard players operation #math_05 value /= #math_04 value
   _.if(calc.x.greaterThan(calc.z), () => { calc.a.divide(calc.x)})
   .else(() => { calc.a.divide(calc.z) });

   $('');
   $('Compute bits');

   // execute if score #math_01 value matches 00.. run scoreboard players set #math_06 value 8
   _.if(vec_x.matches([ 0, null ]), () => { calc.b.set(8) })
   // execute if score #math_06 value matches 0 if score #math_02 value matches ..-1 run scoreboard players set #math_07 value 4
   .elseIf(vec_z.matches([ null, -1 ]), () => calc.c.set(4));

   // execute if score #math_06 value matches 8 if score #math_02 value matches 00.. run scoreboard players set #math_07 value 4
   _.if(_.and(calc.a.matches(8), vec_z.matches([ 0, null ])), () => { calc.c.set(4) });

   $('ugh is this it');
   // execute if score #math_07 value matches 0 if score #math_03 value > #math_04 value run scoreboard players set #math_08 value 2
   // execute if score #math_07 value matches 4 if score #math_03 value <= #math_04 value run scoreboard players set #math_08 value 2
   _.if(_.or(
         _.and(calc.c.matches(0), calc.x.greaterThan(calc.z)),
         _.and(calc.c.matches(4), calc.x.lessOrEqualThan(calc.z))), 
      () => { calc.d.set(2) }
   // execute if score #math_08 value matches 0 if score #math_05 value matches 414.. run scoreboard players set #math_09 value 1
   ).elseIf(calc.a.matches([ 414, null ]), () => { calc.e.set(1) });
   $('end the ugh');
   // execute if score #math_08 value matches 2 if score #math_05 value matches ..413 run scoreboard players set #math_09 value 1
   _.if(_.and(calc.d.matches(0), calc.a.matches([ null, 413 ])), () => { calc.e.set(1) });

   $('');
   $('Compile value');

   // scoreboard players operation #math_06 value += #math_07 value
   // scoreboard players operation #math_06 value += #math_08 value
   // scoreboard players operation #math_06 value += #math_09 value
   calc.b.add(calc.c).add(calc.d).add(calc.e);

   // scoreboard players operation #math_07 value = @s yaw_previous
   // scoreboard players operation #math_07 value /= #225 value
   calc.c.set(input.absolute.rotation).divide(225);
   // scoreboard players operation #math_06 value -= #math_07 value
   // scoreboard players operation #math_06 value %= #16 value
   calc.b.remove(calc.c).modulo(16);

   $('');
   $('Set direction');

   // execute if score #math_06 value matches 02..06 run scoreboard players set #math_00 value 1
   // execute if score #math_06 value matches 10..14 run scoreboard players set #math_00 value 3

   return calc.b;
}