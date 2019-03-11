package com.example.OnlineChatApp.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/app")
public class InitialConnectController {

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String loginGet(){
        System.out.println("login get");
        return "/login.html";
    }
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String loginPost(){
        System.out.println("login post");
        return "/login";
    }


    @RequestMapping("/messenger")
    public String mainPage(){
        System.out.println("messenger");
        return "/index";
    }

    @RequestMapping(value = "/sign-up", method = RequestMethod.GET)
    public String signUpGet(){
        System.out.println("sign up get");
        return "sign-up.html";
    }

    @RequestMapping(value = "/sign-up", method = RequestMethod.POST)
    public String signUpPost(){
        System.out.println("sign up post");
//        return "/index";
        return "redirect:/app/messenger";
    }
}
