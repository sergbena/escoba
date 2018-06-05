class User{

    constructor(id,name,email,img){

        this.name=name;
        this.id=id;
        this.email=email;
        this.img=img;

    }

    // gets
    get name(){
        return this._name;
    }

    get email(){
        return this._email;
    }

    get img(){
        return this._img;
    }

    // sets
    set name(name){
        this._name=name;
    }

    set email(email){
        this._email=email;
    }

    set img(img){
        this._img=img;
    }

}

module.exports = User;