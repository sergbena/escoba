class Player{

    constructor(id,name,hand,carts,points,turn,last){
        this.id= id;
        this.name= name;
        this.hand=hand;
        this.carts=carts;
        this.points=points;
        this.turn=turn;
        this._last=last;
    }

    // gets
    get name(){
        return this._name;
    }

    get hand(){
        return this._hand;
    }

    get carts(){
        return this._carts;
    }

    get points(){
        return this._carts;
    }

    get turn(){
        return this._turn=turn;
    }

    get last(){
        return this._last=last;
    }

    // sets
    set name(name){
        this._name=name;
    }

    set hand(hand){
        this._hand=hand;
    }

    set carts(carts){
        this._carts=carts;
    }

    set points(points){
        this._points=points;
    }

    set turn(turn){
        this._turn = turn;
    }

    set last(last){
        this._last=last;
    }

}

module.exports = Player;