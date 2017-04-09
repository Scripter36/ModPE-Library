ModPE.native = {
    Level: Level,
    Player: Player,
    Entity: Entity,
    Item: Item,
    Block: Block,
    Server: Server
};
threads = [];
ModPE.isRethodLoaded = false;

/**
 * setTimeout in ModPE
 * @param {function} func function
 * @param {time} time     millisecond
 * @return {Number}       thread number
 */
var setTimeout = function(func, time) {
    var thread = new java.lang.Thread(new java.lang.Runnable({
        run: function() {
            try {
                try {
                    java.lang.Thread.sleep(time);
                } catch (e) {
                    threads.splice(thread);
                }
                net.zhuoweizhang.mcpelauncher.ScriptManager.runOnMainThread(new java.lang.Runnable({
                    run: function() {
                        func();
                        threads.splice(thread);
                    }
                }));
            } catch (e) {
                print(e + '\n' + e.lineNumber);
                threads.splice(thread);
            }
        }
    }));
    threads.push(thread);
    thread.start();
    return threads.length - 1;
};

/**
 * clearTimeout in ModPE
 * @param  {Number} number thread number
 */
var clearTimeout = function(number) {
    threads[number].interrupt();
    threads.splice(number, 1);
};

/**
 * setInterval in ModPE
 * @param {function} func function
 * @param {Number} time   millisecond
 * @return {Number}       thread number
 */
var setInterval = function(func, time) {
    var thread = new java.lang.Thread(new java.lang.Runnable({
        run: function() {
            try {
                while (!java.lang.Thread.currentThread().isInterrupted()) {
                    java.lang.Thread.sleep(time);
                    net.zhuoweizhang.mcpelauncher.ScriptManager.runOnMainThread(new java.lang.Runnable({
                        run: func
                    }));
                }
                threads.splice(thread);
            } catch (e) {
                print(e + '\n' + e.lineNumber);
                threads.splice(thread);
            }
        }
    }));
    threads.push(thread);
    thread.start();
    return threads.length - 1;
};

/**
 * clearInterval in ModPE
 * @param  {Number} number thread number
 */
var clearInterval = function(number) {
    threads[number].interrupt();
    threads.splice(number, 1);
};

ModPE.getServer = function() {
    return new Server();
};

var ScriptManager = net.zhuoweizhang.mcpelauncher.ScriptManager;

/**
 * @class
 * Server Object
 */
var Server = function() {

    /**
     * Checks is entity player
     * @param  {Entity}  entity entity
     * @return {Boolean}        isPlayer
     */
    this.isPlayer = function(entity) {
        return ModPE.native.Player.isPlayer(entity.getEntityId());
    };

    /**
     * makes entity to player
     * @param  {Entity} entity target entity
     * @return {Player}        player
     */
    this.entityToPlayer = function(entity) {
        if (ModPE.native.Player.isPlayer(entity.getEntityId())) {
            return new Player(entity.getEntityId());
        }
    };

    /**
     * returns local player Object
     * @return {LocalPlayer} local player
     */
    this.getLocalPlayer = function(){
        return new LocalPlayer(ModPE.native.Player.getEntity());
    };

    /**
     * sends Message to everyone
     * @param  {String} message message
     * @return {Boolean}        succeeded
     */
    this.sendMessage = function(message) {
        var version = ModPE.getMinecraftVersion();
        if (version.startsWith("0") && parseInt(version.split(".")[1]) <= 14) { // <= 0.14
            var p = ModPE.native.Player.getEntity();
            var pn = ModPE.native.Entity.getNameTag(p);
            Entity.setNameTag(p, "");
            ScriptManager.nativeSendChat(message);
            Entity.setNameTag(p, pn);
            return true;
        } else {
            if (ModPE.isRethodLoaded) {
                R_Server.sendMessage(message);
                return true;
            }
        }
        return false;
    };
};

/**
 * @class
 * Item Object
 * @param {Number} id item id
 * @param {Number} count item count
 * @param {Number} damage item damage
 * @param {String} name item name
 */
var Item = function(id, count, damage, name) {
    this.id = id;
    this.count = count;
    this.damage = damage;
    this.name = name || ModPE.native.Item.getName(id, damage);
    /**
     * returns item id
     * @return {Number} item id
     */
    this.getId = function() {
        return this.id;
    };

    /**
     * sets item id
     * @param {Number} id item id
     */
    this.setId = function(id) {
        this.id = id;
        return this;
    };

    /**
     * returns item count
     * @return {Number} item count
     */
    this.getCount = function() {
        return this.count;
    };

    /**
     * sets item count
     * @param {Number} count item count
     */
    this.setCount = function(count) {
        this.count = count;
        return this;
    };

    /**
     * returns item damage
     * @return {Number} item damage
     */
    this.getDamage = function() {
        return this.damage;
    };

    /**
     * sets item damage
     * @param {Number} damage item damage
     */
    this.setDamage = function(damage) {
        this.damage = damage;
        return this;
    };

    /**
     * returns item name
     * @return {String} item name
     */
    this.getName = function() {
        return this.name;
    };

    /**
     * sets item name
     * @param {String} name item name
     */
    this.setName = function(name) {
        this.name = name;
        return this;
    };
};

/**
 * @class
 * Block Object
 * @param {Number} id       block id
 * @param {Number} damage   block damage
 */
var Block = function(id, damage){
    this.id = id || ModPE.native.Level.getTile(position[0], position[1], position[2]);
    this.damage = damage || ModPE.native.Level.getData(position[0], position[1], position[2]);

    /**
     * returns item id
     * @return {Number} item id
     */
    this.getId = function() {
        return this.id;
    };

    /**
     * sets item id
     * @param {Number} id item id
     */
    this.setId = function(id) {
        this.id = id;
        return this;
    };

    /**
     * returns item damage
     * @return {Number} item damage
     */
    this.getDamage = function() {
        return this.damage;
    };

    /**
     * sets item damage
     * @param {Number} damage item damage
     */
    this.setDamage = function(damage) {
        this.damage = damage;
        return this;
    };

    /**
     * defines new Block
     * @param  {String} name       Block's name
     * @param  {Array} texture     Block's texture
     * @param  {Number} material   Block's material Number
     * @param  {Number} opaque     Block's opaque
     * @param  {Number} renderType Block's renderType
     */
    this.defineBlock = function(name, texture, material, opaque, renderType) {
        ModPE.native.Block.defineBlock(this.id, name, texture, material, opaque, renderType);
        return this;
    };

    /**
     * defines Liquid Block
     * @param  {String} name     Block's name
     * @param  {Array} texture   Block's texture
     * @param  {Number} material Block's material Number
     */
    this.defineLiquidBlock = function(name, texture, material){
        ModPE.native.Block.defineLiquidBlock(this.id, name, texture, material);
        return this;
    };

    /**
     * returns Block's destroy time
     * @return {Number} destroy time
     */
    this.getDestroyTime = function(){
        return ModPE.native.Block.getDestroyTime(this.id);
    };

    /**
     * sets Block's destroy time
     * @param {Number} time destroy time
     */
    this.setDestroyTime = function(time){
        ModPE.native.Block.setDestroyTime(this.id, time);
        return this;
    };

    /**
     * returns Block's Friction (0 <= Friction <= 1)
     * @return {Number} Block's Friction
     */
    this.getFriction = function(){
        return ModPE.native.Block.getFriction(this.id);
    };

    /**
     * sets Block's Friction (0 <= Friction <= 1, if Friction == 0, Player's position becomes NaN)
     * @param {Number} friction Block's Friction
     */
    this.setFriction = function(friction){
        ModPE.native.Block.setFriction(this.id, friction);
        return this;
    };

    /**
     * returns Block's render layer
     * @return {Number} render layer
     */
    this.getRenderLayer = function(){
        return ModPE.native.Block.getRenderLayer(this.id);
    };

    /**
     * sets Block's render layer
     * @param {Number} renderLayer render layer
     */
    this.setRenderLayer = function(renderLayer){
        ModPE.native.Block.setRenderLayer(this.id, renderLayer);
    };

    /**
     * returns Block's render type
     * @return {Number} render type
     */
    this.getRenderType = function(){
        return ModPE.native.Block.getRenderType(this.id);
    };

    /**
     * sets Block's render type
     * @param {Number} renderType render type
     */
    this.setRenderType = function(renderType){
        ModPE.native.Block.setRenderType(this.id, renderType);
    };

    /**
     * returns Block's texture coords
     * @param  {Number} side Block side(0 <= side <= 5, y- y+ z- z+ x- x+)
     * @return {Number}      texture coord
     */
    this.getTextureCoords = function(side){
        return ModPE.native.Block.getTextureCoords(this.id, side, this.damage);
    };

    /**
     * sets Block's color
     * @param {Array} color color[damage 0 color, damage 1 color, ...]
     */
    this.setColor = function(color){
        ModPE.native.Block.setColor(this.id, color);
        return this;
    };

    /**
     * sets Block's explosion resistance
     * @param {Number} resesistance explosion resistance
     */
    this.setExplosionResistance = function(resesistance){
        ModPE.native.Block.setExplosionResistance(this.id, resesistance);
    };

    /**
     * sets Block's light level
     * @param {Number} level light level(15 = torch, 16 = glowstone, sunlight)
     */
    this.setLightLevel = function(level){
        ModPE.native.Block.setLightLevel(this.id, level);
        return this;
    };

    /**
     * sets Block's light opacity
     * @param {Number} opacity light opacity
     */
    this.setLightOpacity = function(opacity){
        ModPE.native.Block.setLightOpacity(this.id, opacity);
        return this;
    };

    /**
     * makes Block consume redstone
     * @param {Boolean} callRedstoneUpdateHook true->calls redstoneUpdateHook
     */
    this.setRedstoneConsumer = function(callRedstoneUpdateHook){
        ModPE.native.Block.setRedstoneConsumer(this.id, callRedstoneUpdateHook);
        return this;
    };

    /**
     * sets Block's shape
     * @param {Array} startPosition start Position[x, t, z]
     * @param {Array} endPosition   end Position[x, t, z]
     * @param {Number} damage       Block damage
     */
    this.setShape = function(startPosition, endPosition, damage){
        ModPE.native.Block.setShape(this.id, startPosition[0], startPosition[1], startPosition[2], endPosition[0], endPosition[1], endPosition[2], damage);
    };
};

/**
 * @class
 * Entity Object
 * @param {Number} id Entity code
 */
var Entity = function(id) {
    this.id = id;

    /**
     * returns entity id
     * @return {Number} entity id
     */
    this.getEntityId = function() {
        return this.id;
    };

    /**
     * removes entity
     */
    this.remove = function() {
        ModPE.native.Entity.remove(this.id);
        return this;
    };

    /**
     * kills entity (instant damage effect)
     */
    this.kill = function() {
        ModPE.native.Entity.addEffect(this.id, 7, 1000, 4);
        return this;
    };

    /**
     * gives effect to entity
     * @param {Number} id          effect id
     * @param {Number} time        effect tick
     * @param {Number} power       effect power (0 = I)
     * @param {Boolean} ambient
     * @param {Boolean} hideEffect effect particle
     */
    this.addEffect = function(id, time, power, ambient, hideEffect) {
        ModPE.native.Entity.addEffect(this.id, id, time, power, ambient, hideEffect);
        return this;
    };

    /**
     * returns animal age (age <= 0, means time to grow)
     * @return {Number} age
     */
    this.getAnimalAge = function() {
        return ModPE.native.Entity.getAnimalAge(this.id);
    };

    /**
     * sets animal age (age <= 0, means time to grow)
     * @param {Number} age age
     */
    this.setAnimalAge = function(age) {
        ModPE.native.Entity.setAnimalAge(this.id, age);
        return this;
    };

    /**
     * gets wearing Armor
     * @param  {Number} slot Armor slot (0 <= slot <= 3)
     * @return {Item}        Armor Item
     */
    this.getArmor = function(slot) {
        if (!slot) {
            return [
                new Item(ModPE.native.Entity.getArmor(this.id, 0), 1, ModPE.native.Entity.getArmorDamage(this.id, 0), ModPE.native.Entity.getArmorCustomName(this.id, 0)),
                new Item(ModPE.native.Entity.getArmor(this.id, 1), 1, ModPE.native.Entity.getArmorDamage(this.id, 1), ModPE.native.Entity.getArmorCustomName(this.id, 1)),
                new Item(ModPE.native.Entity.getArmor(this.id, 2), 1, ModPE.native.Entity.getArmorDamage(this.id, 2), ModPE.native.Entity.getArmorCustomName(this.id, 2)),
                new Item(ModPE.native.Entity.getArmor(this.id, 3), 1, ModPE.native.Entity.getArmorDamage(this.id, 3), ModPE.native.Entity.getArmorCustomName(this.id, 3)),
            ];
        } else {
            return new Item(ModPE.native.Entity.getArmor(this.id, slot), 1, ModPE.native.Entity.getArmorDamage(this.id, slot), ModPE.native.Entity.getArmorCustomName(this.id, slot));
        }
    };

    /**
     * sets wearing Armor
     * @param {Item} item   Armor Item
     * @param {Number} slot Armor slot
     */
    this.setArmor = function(item, slot) {
        ModPE.native.Entity.setArmor(this.id, slot, item.getId(), item.getCount(), item.getDamage());
        ModPE.native.Entity.setArmorCustomName(this.id, slot, item.getName());
        return this;
    };

    /**
     * sets wearing cape
     * @param {String} path cape path
     */
    this.setCape = function(path) {
        ModPE.native.Entity.setCape(this.id, path);
        return this;
    };

    /**
     * returns type id
     * @return {Number} type id
     */
    this.getEntityTypeId = function() {
        return ModPE.native.Entity.getEntityTypeId(this.id);
    };

    /**
     * returns extra data
     * @param  {String} key key(should like a.b.c)
     * @return {String}     value
     */
    this.getExtraData = function(key) {
        return ModPE.native.Entity.getExtraData(this.id, key);
    };

    /**
     * sets extra data
     * @param {String} key   key(should like a.b.c)
     * @param {String} value value
     */
    this.setExtraData = function(key, value) {
        ModPE.native.Entity.setExtraData(this.id, key, value);
        return this;
    };

    /**
     * returns health
     * @return {Number} health
     */
    this.getHealth = function() {
        return ModPE.native.Entity.getHealth(this.id);
    };

    /**
     * sets health
     * @param {Number} health health
     */
    this.setHealth = function(health) {
        ModPE.native.Entity.setHealth(this.id, health);
        return this;
    };

    /**
     * returns max health
     * @return {Number} health
     */
    this.getMaxHealth = function() {
        return ModPE.native.Entity.getMaxHealth(this.id);
    };

    /**
     * sets max health
     * @param {Number} health health
     */
    this.setMaxHealth = function(health) {
        ModPE.native.Entity.setMaxHealth(this.id, health);
        return this;
    };

    /**
     * returns mob skin
     * @return {String} path
     */
    this.getMobSkin = function() {
        return ModPE.native.Entity.getMobSkin(this.id);
    };

    /**
     * sets mob skin
     * @param {String} path skin path
     */
    this.setMobSkin = function(path) {
        ModPE.native.Entity.setMobSkin(this.id, path);
        return this;
    };

    /**
     * returns name tag
     * @return {String} nameTag
     */
    this.getNameTag = function() {
        return ModPE.native.Entity.getNameTag(this.id);
    };

    /**
     * sets name tag
     * @param {String} name nameTag
     */
    this.setNameTag = function(name) {
        ModPE.native.Entity.setName(name);
        return this;
    };

    /**
     * returns pitch
     * @return {Number} pitch
     */
    this.getPitch = function() {
        return ModPE.native.Entity.getPitch(this.id);
    };

    /**
     * returns yaw
     * @return {Number} yaw
     */
    this.getYaw = function() {
        return ModPE.native.Entity.getYaw(this.id);
    };

    /**
     * sets pitch
     * @param {Number} pitch pitch
     */
    this.setPitch = function(pitch) {
        ModPE.native.Entity.setRot(this.id, this.getYaw(), pitch);
        return this;
    };

    /**
     * sets yaw
     * @param {Number} yaw yaw
     */
    this.setYaw = function(yaw) {
        ModPE.native.Entity.setRot(this.id, yaw, this.getPitch());
        return this;
    };

    /**
     * returns rot
     * @return {Array} rot[yaw, pitch]
     */
    this.getRot = function() {
        return [ModPE.native.Entity.getYaw(this.id), ModPE.native.Entity.getPitch(this.id)];
    };

    /**
     * sets rot
     * @param {Array} rot rot[yaw, pitch]
     */
    this.setRot = function() {
        if (arguments.length === 1) {
            ModPE.native.Entity.setRot(this.id, arguments[0][0], arguments[0][1]);
        } else {
            ModPE.native.Entity.setRot(this.id, arguments[0], arguments[1]);
        }
        return this;
    };

    /**
     * sets Position
     * @param {Array} position Position[x, y, z]
     * @param {Boolean} isMulti use setPosition / rideAnimal
     */
    this.setPosition = function() {
        if (arguments.length === 2) {
            if (arguments[1]) {
                chicken = ModPE.native.Level.spawnMob(arguments[0][0], arguments[0][1], arguments[0][2], 10);
                ModPE.native.Entity.rideAnimal(this.id, chicken);
            } else {
                ModPE.native.Entity.setPosition(this.id, arguments[0][0], arguments[0][1], arguments[0][2]);
            }
        } else {
            if (arguments[3]) {
                chicken = ModPE.native.Level.spawnMob(arguments[0], arguments[1], arguments[2], 10);
                ModPE.native.Entity.rideAnimal(this.id, chicken);
            } else {
                ModPE.native.Entity.setPosition(this.id, arguments[0], arguments[1], arguments[2]);
            }
        }
        return this;
    };

    /**
     * returns position
     * @return {Array} position[x, y, z]
     */
    this.getPosition = function() {
        return [
            ModPE.native.Entity.getX(this.id),
            ModPE.native.Entity.getY(this.id),
            ModPE.native.Entity.getZ(this.id)
        ];
    };

    /**
     * returns x position
     * @return {Number} x position
     */
    this.getX = function() {
        return ModPE.native.Entity.getX(this.id);
    };

    /**
     * sets x position
     * @param {Number} x        x position
     * @param {Boolean} isMulti use setPosition / rideAnimal
     */
    this.setX = function(x, isMulti) {
        if (isMulti) {
            var chicken = ModPE.native.Level.spawnMob(x, ModPE.native.Entity.getY(this.id), ModPE.native.Entity.getZ(this.id), 10);
            ModPE.native.Entity.rideAnimal(this.id, chicken);
        } else {
            ModPE.native.Entity.setPosition(this.id, x, ModPE.native.Entity.getY(this.id), ModPE.native.Entity.getZ(this.id));
        }
        return this;
    };

    /**
     * returns y position
     * @return {Number} y position
     */
    this.getY = function() {
        return ModPE.native.Entity.getY(this.id);
    };

    /**
     * sets y position
     * @param {Number} y        y position
     * @param {Boolean} isMulti use setPosition / rideAnimal
     */
    this.setY = function(y, isMulti) {
        if (isMulti) {
            var chicken = ModPE.native.Level.spawnMob(ModPE.native.Entity.getZ(this.id), y, ModPE.native.Entity.getZ(this.id), 10);
            ModPE.native.Entity.rideAnimal(this.id, chicken);
        } else {
            ModPE.native.Entity.setPosition(this.id, ModPE.native.Entity.getX(this.id), y, ModPE.native.Entity.getZ(this.id));
        }
        return this;
    };

    /**
     * returns z position
     * @return {Number} z position
     */
    this.getZ = function() {
        return ModPE.native.Entity.getZ(this.id);
    };

    /**
     * sets z position
     * @param {Number} z        z position
     * @param {Boolean} isMulti use setPosition / rideAnimal
     */
    this.setZ = function(z, isMulti) {
        if (isMulti) {
            var chicken = ModPE.native.Level.spawnMob(ModPE.native.Entity.getX(this.id), ModPE.native.Entity.getY(this.id), z, 10);
            ModPE.native.Entity.rideAnimal(this.id, chicken);
        } else {
            ModPE.native.Entity.setPosition(this.id, ModPE.native.Entity.getX(this.id), ModPE.native.Entity.getY(this.id), z);
        }
        return this;
    };

    /**
     * sets Position Relative
     * @param {Array} position Position[x, y, z]
     * @param {Boolean} isMulti use setPosition / rideAnimal
     */
    this.setPositionRelative = function() {
        var x = ModPE.native.Entity.getX(this.id);
        var y = ModPE.native.Entity.getY(this.id);
        var z = ModPE.native.Entity.getZ(this.id);
        if (arguments.length === 2) {
            if (arguments[1]) {
                chicken = ModPE.native.Level.spawnMob(x + arguments[0][0], y + arguments[0][1], z + arguments[0][2], 10);
                ModPE.native.Entity.rideAnimal(this.id, chicken);
            } else {
                ModPE.native.Entity.setPosition(this.id, x + arguments[0][0], y + arguments[0][1], z + arguments[0][2]);
            }
        } else {
            if (arguments[3]) {
                chicken = ModPE.native.Level.spawnMob(x + arguments[0], y + arguments[1], z + arguments[2], 10);
                ModPE.native.Entity.rideAnimal(this.id, chicken);
            } else {
                ModPE.native.Entity.setPosition(this.id, x + arguments[0], y + arguments[1], z + arguments[2]);
            }
        }
        return this;
    };

    /**
     * returns rider number(not entity id)
     * @return {Number} rider number
     */
    this.getRider = function() {
        var rider = ModPE.native.Entity.getRider(this.id);
        if (rider === -1) return;
        return rider;
    };

    /**
     * returns riding number(not entity id)
     * @return {Number} riding number
     */
    this.getRiding = function() {
        var riding = ModPE.native.Entity.getRiding(this.id);
        if (riding === -1) return;
        return riding;
    };

    /**
     * returns target entity
     * @return {Entity} target
     */
    this.getTarget = function() {
        return new Entity(ModPE.native.Entity.getTarget(this.id));
    };

    /**
     * sets target entity
     * @param {Entity} target target
     */
    this.setTarget = function(target) {
        ModPE.native.Entity.setTarget(this.id, target.getEntityId());
        return this;
    };

    /**
     * returns Unique id
     * @return {String} unique id
     */
    this.getUniqueId = function() {
        return ModPE.native.Entity.getUniqueId(this.id);
    };

    /**
     * returns velocity
     * @return {Array} velocity[x, y, z]
     */
    this.getVel = function() {
        return [
            ModPE.native.Entity.getVelX(this.id),
            ModPE.native.Entity.getVelY(this.id),
            ModPE.native.Entity.getVelZ(this.id)
        ];
    };

    /**
     * sets velocity
     * @param {Array} velocity velocity[x, y, z]
     */
    this.setVel = function() {
        if (arguments.length === 1) {
            ModPE.native.Entity.setVelX(this.id, arguments[0][0]);
            ModPE.native.Entity.setVelY(this.id, arguments[0][1]);
            ModPE.native.Entity.setVelZ(this.id, arguments[0][2]);
        } else {
            ModPE.native.Entity.setVelX(this.id, arguments[0]);
            ModPE.native.Entity.setVelY(this.id, arguments[1]);
            ModPE.native.Entity.setVelZ(this.id, arguments[2]);
        }
        return this;
    };

    /**
     * returns x velocity
     * @return {Number} x velocity
     */
    this.getVelX = function() {
        return ModPE.native.Entity.getVelX(this.id);
    };

    /**
     * sets x velocity
     * @param {Number} x x velocity
     */
    this.setVelX = function(x) {
        ModPE.native.Entity.setVelX(this.id, x);
        return this;
    };

    /**
     * returns y velocity
     * @return {Number} y velocity
     */
    this.getVelY = function() {
        return ModPE.native.Entity.getVelY(this.id);
    };

    /**
     * sets y velocity
     * @param {Number} y y velocity
     */
    this.setVelY = function(y) {
        ModPE.native.Entity.setVelY(this.id, y);
        return this;
    };

    /**
     * returns z velocity
     * @return {Number} z velocity
     */
    this.getVelZ = function() {
        return ModPE.native.Entity.getVelZ(this.id);
    };

    /**
     * sets z velocity
     * @param {Number} z z velocity
     */
    this.setVelZ = function(z) {
        ModPE.native.Entity.setVelZ(this.id, z);
        return this;
    };

    /**
     * returns is entity sneaking
     * @return {Boolean} isSneaking
     */
    this.isSneaking = function() {
        return ModPE.native.Entity.isSneaking(this.id);
    };

    /**
     * sets entity sneaking
     * @param {Boolean} sneak sneaking
     */
    this.setSneaking = function(sneak) {
        ModPE.native.Entity.setSneaking(this.id, sneak);
        return this;
    };

    /**
     * removes effect
     * @param  {Number} id effect id
     */
    this.removeEffect = function(id) {
        ModPE.native.Entity.removeEffect(this.id, id);
        return this;
    };

    /**
     * removes all effects
     */
    this.removeAllEffects = function() {
        ModPE.native.Entity.removeAllEffects(this.id);
        return this;
    };

    /**
     * sets carried item
     * @param {Item} item carried item
     */
    this.setCarriedItem = function(item) {
        ModPE.native.Entity.setCarriedItem(this.id, item.getId(), item.getCount(), item.getDamage());
        return this;
    };

    /**
     * sets entity collision size
     * @param {Array} size size[x, y]
     */
    this.setCollisionSize = function() {
        if (arguments.length === 1) {
            ModPE.native.Entity.setCollisionSize(this.id, arguments[0][0], arguments[0][1]);
        } else {
            ModPE.native.Entity.setCollisionSize(this.id, arguments[0], arguments[1]);
        }
        return this;
    };

    /**
     * makes entity burn
     * @param {Number} tick burn tick
     */
    this.setFireTicks = function(tick) {
        ModPE.native.Entity.setFireTicks(this.id, tick);
        return this;
    };

    /**
     * makes entity immobile
     * @param {Boolean} immobile immobile
     */
    this.setImmobile = function(immobile) {
        ModPE.native.Entity.setImmobile(this.id, immobile);
        return this;
    };

    /**
     * returns entity render type
     * @return {Number} renderType
     */
    this.getRenderType = function() {
        return ModPE.native.Entity.getRenderType(this.id);
    };

    /**
     * sets entity render type
     * @param {Number} type renderType
     */
    this.setRenderType = function(type) {
        ModPE.native.Entity.setRenderType(this.id, type);
        return this;
    };
};

/**
 * @class Player Object
 * @extends Entity
 */
var Player = Entity;

/**
 * returns player name
 * @return {String} name
 */
Player.prototype.getName = function() {
    return ModPE.native.Player.getName(this.id);
};

/**
 * sends message to player (needs RethodPE)
 * @param  {String} message message
 * @return {Boolean}        succeeded
 */
Player.prototype.sendMessage = function(message) {
    if (ModPE.isRethodLoaded) {
        R_Server.sendPrivateMessage(ModPE.native.Entity.getNameTag(this.id), message);
        return true;
    }
    return false;
};

/**
 * @class Local Player Object
 * @extends Player
 */
var LocalPlayer = Player;

/**
 * sends client Message
 * @param  {String} message message
 */
LocalPlayer.prototype.clientMessage = function(message){
    clientMessage(message);
    return this;
};

/**
 * adds exp
 * @param {Number} exp exp
 */
LocalPlayer.prototype.addExp = function(exp){
    ModPE.native.Player.addExp(exp);
    return this;
};

/**
 * returns exp
 * @return {Number} exp
 */
LocalPlayer.prototype.getExp = function(){
    return ModPE.native.Player.getExp();
};

/**
 * sets exp
 * @param {Number} exp exp
 */
LocalPlayer.prototype.setExp = function(exp){
    ModPE.native.Player.setExp(exp);
    return this;
};

/**
 * adds item in creative inventory
 * @param {Item} item item
 */
LocalPlayer.prototype.addItemCreativeInv = function(item){
    ModPE.native.Player.addItemCreativeInv(item.getId(), item.getCount(), item.getDamage());
    return this;
};

/**
 * adds item in inventory
 * @param {Item} item item
 */
LocalPlayer.prototype.addItemInventory = function(item){
    ModPE.native.Player.addItemInventory(item.getId(), item.getCount(), item.getDamage());
    return this;
};

/**
 * returns is player can fly
 * @return {Boolean} can fly
 */
LocalPlayer.prototype.canFly = function(){
    return ModPE.native.Player.canFly();
};

/**
 * sets player can fly
 * @param {Boolean} fly can fly
 */
LocalPlayer.prototype.setCanFly = function(fly){
    ModPE.native.Player.setCanFly(fly);
    return this;
};

/**
 * clears inventory slot
 * @param  {Number} slot slot number(0 <= slot <= 27)
 */
LocalPlayer.prototype.clearInventorySlot = function(slot){
    ModPE.native.Player.clearInventorySlot(slot);
    return this;
};

/**
 * enchants item
 * @param  {Number} slot  slot
 * @param  {Number} id    enchant id
 * @param  {Number} power enchant power
 */
LocalPlayer.prototype.enchant = function(slot, id, power){
    ModPE.native.Player.enchant(slot, id, power);
    return this;
};

/**
 * returns Armor
 * @param  {Number} slot slot
 * @return {Item}        Armor item
 */
LocalPlayer.prototype.getArmor = function(slot){
    if (!slot){
        return [
        new Item(ModPE.native.Player.getArmorSlot(0), 1, ModPE.native.Player.getArmorSlotDamage(0)),
        new Item(ModPE.native.Player.getArmorSlot(1), 1, ModPE.native.Player.getArmorSlotDamage(1)),
        new Item(ModPE.native.Player.getArmorSlot(2), 1, ModPE.native.Player.getArmorSlotDamage(2)),
        new Item(ModPE.native.Player.getArmorSlot(3), 1, ModPE.native.Player.getArmorSlotDamage(3)),
    ];
    } else {
        return new Item(ModPE.native.Player.getArmorSlot(slot), 1, ModPE.native.Player.getArmorSlotDamage(slot));
    }
};

/**
 * sets Armor
 * @param {Item} item Armor item
 * @param {Number} slot slot
 */
LocalPlayer.prototype.setArmor = function(item, slot){
    ModPE.native.Player.setArmor(slot, item.getId(), item.getCount(), item.getDamage());
        ModPE.native.Player.setArmorCustomName(slot, item.getName());
        return this;
};

/**
 * returns carring item
 * @return {Item} carring item
 */
LocalPlayer.prototype.getCarriedItem = function(){
    return new Item(ModPE.native.Player.getCarriedItem(), ModPE.native.Player.getCarriedItemCount(), ModPE.native.Player.getCarriedItemData());
};

/**
 * sets carring item
 * @param {Item} item carring item
 */
LocalPlayer.prototype.setCarriedItem = function(item){
    ModPE.native.Player.setCarriedItem(item.getId(), item.getCount(), item.getDamage());
    return this;
};

/**
 * gets player dimension
 * @return {Number} dimension
 */
LocalPlayer.prototype.getDimension = function(){
    return ModPE.native.Player.getDimension();
};

/**
 * returns enchantments
 * @param  {Number} slot slot
 * @return {Array}       enchantments
 */
LocalPlayer.prototype.getEnchantments = function(slot){
    return ModPE.native.Player.getEnchantments(slot);
};

/**
 * returns exhaustion
 * @return {Number} exhaustion
 */
LocalPlayer.prototype.getExhaustion = function(){
    return ModPE.native.Player.getExhaustion();
};

/**
 * sets exhaustion
 * @param {Number} exhaustion exhaustion
 */
LocalPlayer.prototype.setExhaustion = function(exhaustion){
    ModPE.native.Player.setExhaustion(exhaustion);
    return this;
};

/**
 * returns hunger
 * @return {Number} hunger
 */
LocalPlayer.prototype.getHunger = function(){
    return ModPE.native.Player.getHunger();
};

/**
 * sets hunger
 * @param {Number} hunger hunger
 */
LocalPlayer.prototype.setHunger = function(hunger){
    ModPE.native.Player.setHunger(hunger);
    return this;
};

/**
 * returns inventory slot
 * @param  {Number} slot slot number(0 <= slot <= 27)
 * @return {Item}      item
 */
LocalPlayer.prototype.getInventory = function(slot){
    if (!slot){
        return new Item(ModPE.native.Player.getInventorySlot(slot), ModPE.native.Player.getInventorySlotCount(slot), ModPE.native.Player.getInventorySlotData(slot));
    } else {
        var ans = [];
        for (var i = 0 ; i < 27 ; i++) ans.push(new Item(ModPE.native.Player.getInventorySlot(i), ModPE.native.Player.getInventorySlotCount(i), ModPE.native.Player.getInventorySlotData(i)));
        return ans;
    }
};

/**
 * sets inventory slot
 * @param {Number} slot slot number(0 <= slot <= 27)
 * @param {Item} item   item
 */
LocalPlayer.prototype.setInventory = function(slot, item){
    ModPE.native.Player.setInventorySlot(slot, item.getId(), item.getCount(), item.getDamage());
    return this;
};

/**
 * returns level
 * @return {Number} level
 */
LocalPlayer.prototype.getLevel = function(){
    return ModPE.native.Player.getLevel();
};

/**
 * sets level
 * @param {Number} level level
 */
LocalPlayer.prototype.setLevel = function(level){
    ModPE.native.Player.setLevel(level);
    return this;
};

/**
 * returns pointed Block
 * @return {Block} pointed block
 */
LocalPlayer.prototype.getPointedBlock = function(){
    return new Block(ModPE.native.Player.getPointedBlockId(), 1, ModPE.native.Player.getPointedBlockData());
};

/**
 * returns pointed side
 * @return {Number} side(0 <= side <= 5, y- y+ z- z+ x- x+)
 */
LocalPlayer.prototype.getPointedBlockSide = function(){
    return ModPE.native.Player.getPointedBlockSide();
};

/**
 * returns pointed block position
 * @return {Array} Position[x, y, z]
 */
LocalPlayer.prototype.getPointedBlockPosition = function(){
    return [ModPE.native.Player.getPointedBlockX(), ModPE.native.Player.getPointedBlockY(), ModPE.native.Player.getPointedBlockZ()];
};

/**
 * returns pointed block x
 * @return {Number} x position
 */
LocalPlayer.prototype.getPointedBlockX = function(){
    return ModPE.native.Player.getPointedBlockX();
};

/**
 * returns pointed block y
 * @return {Number} y position
 */
LocalPlayer.prototype.getPointedBlockY = function(){
    return ModPE.native.Player.getPointedBlockY();
};

/**
 * returns pointed block z
 * @return {Number} z position
 */
LocalPlayer.prototype.getPointedBlockZ = function(){
    return ModPE.native.Player.getPointedBlockZ();
};

/**
 * returns pointed Entity
 * @return {Entity} Pointed Entity
 */
LocalPlayer.prototype.getPointedEntity = function(){
    return new Entity(ModPE.native.Player.getPointedEntity());
};

/**
 * returns pointed vec
 * @return {Array} vec[x, y, z]
 */
LocalPlayer.prototype.getPointedVec = function(){
    return [ModPE.native.Player.getPointedVecX(), ModPE.native.Player.getPointedVecY(), ModPE.native.Player.getPointedVecZ()];
};

/**
 * returns pointed x vec
 * @return {Number} x vec
 */
LocalPlayer.prototype.getPointedVecX = function(){
    return ModPE.native.Player.getPointedVecX();
};

/**
 * returns pointed y vec
 * @return {Number} y vec
 */
LocalPlayer.prototype.getPointedVecY = function(){
    return ModPE.native.Player.getPointedVecY();
};

/**
 * returns pointed z vec
 * @return {Number} z vec
 */
LocalPlayer.prototype.getPointedVecZ = function(){
    return ModPE.native.Player.getPointedVecZ();
};

/**
 * returns saturation
 * @return {Number} saturation
 */
LocalPlayer.prototype.getSaturation = function(){
    return ModPE.native.Player.getSaturation();
};

/**
 * sets saturation
 * @param {Number} saturation saturation
 */
LocalPlayer.prototype.setSaturation = function(saturation){
    ModPE.native.Player.setSaturation(saturation);
};

/**
 * returns score
 * @return {Number} score
 */
LocalPlayer.prototype.getScore = function() {
    return ModPE.native.Player.getScore();
};

/**
 * returns selected slot id
 * @return {Number} slot id
 */
LocalPlayer.prototype.getSelectedSlotId = function(){
    return ModPE.native.Player.getSelectedSlotId();
};

/**
 * sets selected slot id
 * @param {Number} id slot id
 */
LocalPlayer.prototype.setSelectedSlotId = function(id){
    ModPE.native.Player.setSelectedSlotId(id);
    return this;
};

/**
 * returns player position
 * @return {Array} Position[x, y, z]
 */
LocalPlayer.prototype.getPosition = function(){
    return [
        ModPE.native.Player.getX(),
        ModPE.native.Player.getY(),
        ModPE.native.Player.getZ()
    ];
};

/**
 * sets player position
 * @param {Array} position Position[x, y, z]
 */
LocalPlayer.prototype.setPosition = function(){
    if (arguments.length === 2) {
        ModPE.native.Entity.setPosition(this.id, arguments[0][0], arguments[0][1], arguments[0][2]);
    } else {
        ModPE.native.Entity.setPosition(this.id, arguments[0], arguments[1], arguments[2]);
    }
    return this;
};

/**
 * sets x position
 * @param {Number} x x position
 */
LocalPlayer.prototype.setX = function(x){
    ModPE.native.Entity.setPosition(this.id, x, ModPE.native.Player.getY(), ModPE.native.Player.getZ());
    return this;
};

/**
 * returns x position
 * @return {Number} x position
 */
LocalPlayer.prototype.getX = function(){
    return ModPE.native.Player.getX();
};

/**
 * sets y position
 * @param {Number} y y position
 */
LocalPlayer.prototype.setY = function(y){
    ModPE.native.Entity.setPosition(this.id, ModPE.native.Player.getX(), y, ModPE.native.Player.getZ());
    return this;
};

/**
 * returns y position
 * @return {Number} y position
 */
LocalPlayer.prototype.getY = function(){
    return ModPE.native.Player.getY();
};

/**
 * sets z position
 * @param {Number} z z position
 */
LocalPlayer.prototype.setZ = function(z){
    ModPE.native.Entity.setPosition(this.id, ModPE.native.Player.getX(), ModPE.native.Player.getY(), z);
    return this;
};

/**
 * returns z position
 * @return {Number} z position
 */
LocalPlayer.prototype.getZ = function(){
    return ModPE.native.Player.getZ();
};

/**
 * returns is player flying
 * @return {Boolean} is flying
 */
LocalPlayer.prototype.isFlying = function(){
    return ModPE.native.Player.isFlying();
};

/**
 * sets item custom name
 * @param {Number} slot slot Number
 * @param {String} name custom name
 */
LocalPlayer.prototype.setItemCustomName = function(slot, name){
    ModPE.native.Player.setItemCustomName(slot, name);
};


function onRethodPELoaded() {
    ModPE.onRethodLoaded = true;
}
