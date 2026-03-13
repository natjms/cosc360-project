import res from "express"; 
import req from "express"; 
import * as authService from "./login.service.js"

export function create(req, res) { 

    function login(req, res) { 
        const id = req.params.id
        const password = findPasswordById(id)


    }

    if(!password || typeof password !== "string" || !password.trim()) { 
        res.status(400).json( { error: "Password is required "}); 
        return;
    }

    const login = loginService.create(password.trim())

}