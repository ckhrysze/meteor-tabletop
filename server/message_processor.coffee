class MessageProcessor
  constructor: (@character_id) ->
    console.log("In MessageProcessor constructor, char id: #{@character_id}")
    character = Characters.findOne(@character_id)
    @encounter_id = character.encounter_id
    @name = character.name

  process: (message) ->
    return if message == ''

    if message[0] == '/'
      tokens = message.slice(1).split(" ")
      cmd = tokens.shift()
      console.log("Command is #{cmd}")
    else
      cmd = ''

    switch cmd
      when "roll" then this.processRoll(tokens)
      when "nick" then this.processNick(tokens)
      when "ooc" then this.processOOC(tokens)
      when "pm" then this.processPM(tokens)
      else this.processIC(message)

  processRoll: (tokens) ->
    return ''

  processNick: (tokens) ->
    Characters.update({_id: @character_id}, {$set: {name: tokens[0]}})

  processOOC: (tokens) ->
    message = tokens.join(" ")
    this.createMessage(message, 'ooc')

  processPM: (tokens) ->
    target_nick = tokens.shift()
    message = tokens.join(" ")
    console.log("Looking for character with name '#{target_nick}' in encounter '#{@encounter_id}'")
    target = Characters.findOne({encounter_id: @encounter_id, name: target_nick})
    console.log("Target for pm is #{target.name} : #{target._id} \n #{target}")
    this.createMessage(message, 'pm', target._id)

  processIC: (message) ->
    this.createMessage(message, 'ic')

  createMessage: (message, type, target) ->
    newMsg = {}
    newMsg["body"] = message
    newMsg["nick"] = @name
    newMsg["type"] = type
    newMsg["target"] = target
    newMsg["encounter_id"] = @encounter_id
    newMsg["timestamp"] = UTCNow()
    Messages.insert(newMsg)
