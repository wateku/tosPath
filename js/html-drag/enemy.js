
//==============================================================
//==============================================================
// Enemy Database
//==============================================================
//==============================================================
var BasicEnemySetting = function( enemy ){
	return {
		HEALTH   : enemy['health'],
		ATTACK   : enemy['attack'],
		DEFENCE  : enemy['defence'],
		COLOR    : enemy['color'],
		COOLDOWN : enemy['coolDown'],
		SUFFER   : 0,
		HATRED   : [],
		EFFECT   : [],
	};
}

var ENEMY_DATA = {
	EMPTY : {
		id       : 'EMPTY',
		label    : '',
		info     : '',
		health   : Infinity,
		attack   : 1,
		defence  : 0,
		color    : '_',
		coolDown : Infinity,
		ability  : [ "NONE" ],
		preSet   : BasicEnemySetting,
		variable : {},
	},
	NORMAL : {
		id       : 'NORMAL',
		label    : '標靶',
		info     : '普通的練習目標',
		health   : 1000000,
		attack   : 12000,
		defence  : 100,
		color    : 'w',
		coolDown : 3,
		ability  : [ "NONE" ],
		preSet   : BasicEnemySetting,
		variable : {},
	}
};

function NewEnemy( id ){
    var enemyObj = $.extend(true, {}, ENEMY_DATA[id]);
    var ability = [];
    for( var ab in enemyObj['ability'] ){
    	ability.push( ENEMY_ABILITY_DATA[ab] );
    }
    enemyObj['ability'] = ability;
    enemyObj['variable'] = enemyObj['preSet']( enemyObj );
    return enemyObj;
}


var ENEMY_ABILITY_DATA = {
	NONE : {
		id  : 'NONE',
	},
};