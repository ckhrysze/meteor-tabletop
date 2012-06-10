
var processMessage = function(character, msg) {
    if (msg.slice(0,1) === "/") {
	var tokens = msg.slice(1).split(" ");
	var result = processCommand(character, tokens.shift(), tokens);
	return result;
    } else {
	return msg;
    }
};

var processCommand = function(character, cmd, args) {
    console.log("processing command " + cmd);
    console.log("  with arguments " + args);

    switch (cmd) {
    case "roll":
	return rollCommand(character, args.join(""));
	break;
    case "nick":
	if (args.length > 1)
	    return "Cannot process command";
	return nick(character, args[0]);
	break;
    default:
	return cmd + args.join(" ");
    }
};


var nick = function(character, newName) {
    Characters.update({_id: character._id}, {$set: {name: newName}});
    return 0;
};

var basicRoll = /(\d+)d(\d+)/;
var modRoll = /(\d+)d(\d+)\+(\d+)/;

var rollCommand = function(character, arg) {
    var matches = modRoll.exec(arg);
    var result;

    if (matches) {
	result = roll(matches[1], matches[2], matches[3]);
	return " rolled " + arg + " : " + result;
    }

    matches = basicRoll.exec(arg);
    if (matches) {
	result = roll(matches[1], matches[2]);
	return " rolled " + arg + " : " + result;
    }

    return "Invalid Roll";
};

var roll = function(dice, sides, mod) {
    var results = [];
    for (var i=0; i<dice; i++) {
	var die = getRandomInt(sides);
	results.push(die);
    }
    var result = results.reduce(function(sum, i) { return sum+i; });

    var response = results.join(" + ");
    if (mod) {
	result += parseInt(mod);
	response += " + " + mod;
    }
    response += " = " + result;
    return response;
};

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
var getRandomInt = function(max) {
  return Math.floor(Math.random() * max) + 1;
};
