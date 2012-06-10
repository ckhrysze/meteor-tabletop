
// Collection Subscriptions
Meteor.subscribe("encounters", function() {
  if (!Session.get('encounter_id')) {
    var encounter = Encounters.findOne({}, {sort: {name: 1}});
    if (encounter)
      Router.setEncounter(encounter._id);
  }
});

Meteor.autosubscribe(function () {
    var encounter_id = Session.get('encounter_id');
    if (encounter_id) {
	Meteor.subscribe('messages', encounter_id);
	Meteor.subscribe('pieces', encounter_id);
    }
});


function setupMessageObserver() {
    Messages.find({encounter_id: Session.get('encounter_id')}, {sort: {timestamp: 1}}).observe({
	added: function(msg) {
	    console.log(msg);
	    var messageNode = Template.message(msg);
	    var row;
	    var tabLink;

	    if (msg.type === 'ic') {
		$("#tab1 .messages").append(messageNode);
		row = $(".messageRow").last()[0];
	    } else if (msg.type === 'ooc') {
		$("#tab2 .messages").append(messageNode);
		row = $(".messageRow").last()[0];
		row.scrollIntoView(false);
	    } else if (msg.type === 'pm') {
		if (Session.get("character_id") === msg.target) {
		    $("#tab3 .messages").append(messageNode);
		    row = $(".messageRow").last()[0];
		    row.scrollIntoView(false);
		}
	    }

	    if (row)
		row.scrollIntoView(false);

	}
    });
}

// Template Binding
// Template.messages.messages = function() {
//     var encounter_id = Session.get('encounter_id');
//     if (!encounter_id)
// 	return {};
//     return Messages.find({encounter_id: encounter_id}, {sort: {timestamp: 1}});
// };

// Template.messages.scroll_to_bottom = function(blah) {
//     Meteor.defer(function() {
//     });
// };



$("#messageForm").live("submit", function(e) {
    var message = $("#messageInput").val();
    $("#messageInput").val("");

    if (message != "") {
	Meteor.call("newMessage", {character_id: Session.get("character_id")
				   , body: message
				   , encounter_id: Session.get('encounter_id')
				  });
    }
    return false;
});

var createNewEncounter = function() {
    var newId = Encounters.insert({});
    var character_id = Characters.insert( {name: "GM", encounter_id: newId} );

    var colors = ["red", "orange", "yellow", "green", "blue", "purple"];
    for(var i = 0; i < 6; i++) {
        Pieces.insert({encounter_id: newId
		       , x: i * 30 + 12
		       , y: 12
		       , color: colors[i]
		      });
    };

    // set cookie for encounter's GM
    Router.setEncounter(newId);
};

////////// Taken from todos example //////////

var TableTopRouter = Backbone.Router.extend({
    routes: {
	":encounter_id": "main"
    },
    main: function (encounter_id) {
	console.log("Setting encounter id: " + encounter_id);
	Session.set("encounter_id", encounter_id);
    },
    setEncounter: function (encounter_id) {
	this.navigate("/" + encounter_id, {trigger: true, replace: true});
    }
});

var Router = new TableTopRouter;

Meteor.startup(function () {
    Backbone.history.start({pushState: true});

    // No path, so create a new encounter and redirect
    var pathname = window.location.pathname.slice(1);
    if (pathname === "") {
	createNewEncounter();
    } else {
	// check cookies for character id
	var character_id = Characters.insert({name: "anon",
					      encounter_id: Session.get("encounter_id")}
					    );
	Session.set("character_id", character_id);
	setupMessageObserver();
	//initMap();
    }
});
