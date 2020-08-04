
const fs = require( 'fs' );
const mathjs = require( 'mathjs' );

var math = mathjs.create( mathjs.all );

const readJSON = ( path, cb ) => {
  fs.readFile( require.resolve( path ), ( err, data ) => {
    if ( err ) cb( err );
    else cb( null, JSON.parse( data ) );
  } );
};

var pokemonData = {};

const cpms = [
  0.093999997, 0.16639787, 0.21573247, 0.25572005, 0.29024988,
  0.3210876, 0.34921268, 0.37523559, 0.39956728, 0.42250001,
  0.44310755, 0.46279839, 0.48168495, 0.49985844, 0.51739395,
  0.53435433, 0.55079269, 0.56675452, 0.58227891, 0.59740001,
  0.61215729, 0.62656713, 0.64065295, 0.65443563, 0.667934,
  0.68116492, 0.69414365, 0.70688421, 0.71939909, 0.7317,
  0.73776948, 0.74378943, 0.74976104, 0.75568551, 0.76156384,
  0.76739717, 0.7731865, 0.77893275, 0.78463697, 0.79030001,
  0.79530001, 0.8003, 0.8053, 0.81029999, 0.81529999
];

const mathFns = {
  getCpm:     ( level )     => cpms[level],
  getBaseAtk: ( dexNumber ) => pokemonData[dexNumber.toString()].baseAttack,
  getBaseDef: ( dexNumber ) => pokemonData[dexNumber.toString()].baseDefense,
  getBaseHp:  ( dexNumber ) => pokemonData[dexNumber.toString()].baseStamina,
};

const helpers = [
  'baseAtk = getBaseAtk( dexNumber )',
  'baseDef = getBaseDef( dexNumber )',
  'baseHp  = getBaseHp( dexNumber )',
  'cpm     = getCpm( level )',
  'atk     = cpm * ( baseAtk + ivAtk )',
  'def     = cpm * ( baseDef + ivDef )',
  'hp      = max( cpm * ( baseHp + ivHp ) )',
  'cp      = ( atk * sqrt( def ) * sqrt( hp ) * ( cpm ^ 2 ) ) / 10'
];

const scopeForPokemon = ( dexNumber, ivAtk, ivDef, ivHp, level ) =>
      Object.assign( {}, equations, {
        dexNumber: dexNumber.toString(),
        ivAtk: ivAtk, ivDef: ivDef, ivHp: ivHp, level: level
      } );

var solver;

readJSON( '../data/pokemon.json', ( err, pdata ) => {
  if ( err ) {
    console.log( 'Error:', err );
  } else {
    pokemonData = pdata;
    var scope = {
      dexNumber:  1,
      ivAtk:     10,
      ivDef:     10,
      ivHp:      10,
      level:     25,
    };
    math.import( mathFns );
    math.import( scope );
    solver = math.parser();
    helpers.forEach( ( expr ) => solver.evaluate( expr ) );
  }
} );
