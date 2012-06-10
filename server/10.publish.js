
Meteor.publish("encounters", function() {
    return Encounters.find();
});

Meteor.publish('messages', function (encounter_id, character) {
  return Messages.find({encounter_id: encounter_id
			, $or: [{ character: character}
				, {character: null}]
		       });
});

Meteor.publish('characters', function (encounter_id) {
  return Characters.find({encounter_id: encounter_id});
});

Meteor.publish('pieces', function (encounter_id) {
  return Pieces.find({encounter_id: encounter_id});
});

