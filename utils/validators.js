exports.validateRegisterInput = (username, email, password, confirmPassword) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = "Username must not be empty"
    }
    if (email.trim() === "") {
        errors.email = "Email is required field!"
    }else{
        const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!email.match(regEx)){
            errors.email = "Must be a valid email address"
        }
    }

    if(password === ''){
        errors.password = "Password is required";
    }else if(password !== confirmPassword){
        errors.password = "Passwords must match!"
    }

    return{
        errors,
        valid: Object.keys(errors).length < 1
    }
}