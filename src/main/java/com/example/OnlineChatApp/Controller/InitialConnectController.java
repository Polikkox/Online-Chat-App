package com.example.OnlineChatApp.Controller;

import com.example.OnlineChatApp.Service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/app")
public class InitialConnectController {

    private RegistrationService registrationService;

    @Autowired
    public InitialConnectController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String loginGet(){
        return "login.html";
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String loginPost(){
        return "login.html";
    }

    @RequestMapping("/messenger")
    public String mainPage(){
        return "index.html";
    }

    @RequestMapping(value = "/sign-up", method = RequestMethod.GET)
    public String signUpGet(){
        return "sign-up.html";
    }

    @RequestMapping(value = "/sign-up", method = RequestMethod.POST)
    public String signUpPost(@RequestParam(value = "username") String username,
                             @RequestParam(value = "psw") String psw,
                             @RequestParam(value = "psw-repeat") String pswRepeat){

        if(this.registrationService.registerUser(username, psw, pswRepeat)){
            return "redirect:/app/messenger";
        }
        return "sign-up.html";
    }
}
