package com.example.OnlineChatApp.Controller;

import com.example.OnlineChatApp.Service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

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
                                   @RequestParam(value = "psw-repeat") String pswRepeat,
                             Model model){

        if(this.registrationService.loginExist(username)){
            model.addAttribute("loginExist", "display");
            return "sign-up.html";
        }
        if(!this.registrationService.passwordIsValid(psw, pswRepeat)){
            model.addAttribute("passwordIncorrect", "display");
            return "sign-up.html";
        }
        this.registrationService.registerUser(username, psw);
        model.addAttribute("success", "display");
        return "login.html";
    }
}
