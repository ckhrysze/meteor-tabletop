
Meteor.methods(
  newMessage: (args) ->
    processor = new MessageProcessor(args.character_id)
    processor.process(args.body)
    true
)