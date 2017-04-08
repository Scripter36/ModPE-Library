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
 * @class
 * Player Object
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

function onRethodPELoaded() {
    ModPE.onRethodLoaded = true;
}
