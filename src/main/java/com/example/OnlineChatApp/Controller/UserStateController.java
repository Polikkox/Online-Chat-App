package com.example.OnlineChatApp.Controller;

import com.example.OnlineChatApp.Service.LoggedUserHandler;
import com.example.OnlineChatApp.Service.Messenger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.rememberme.AbstractRememberMeServices;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.Map;

@Controller
public class UserStateController {

    private LoggedUserHandler loggedUserHandler;
    private Messenger messenger;

    @Autowired
    public UserStateController(Messenger messenger) {
        this.messenger = messenger;
    }

    @MessageMapping("/getUsers")
    @SendTo("/welcome/onlineUsers")
    public Map<String, String> sendConnectedUsers(){
        return loggedUserHandler.getOnlineUsers();
    }

    @MessageMapping("/deleteUser")
    @SendTo("/welcome/onlineUsers")
    public Map<String, String> deleteDisconnectedUser(Principal principal){
        this.loggedUserHandler.removeUserByUserName(principal.getName());
        return this.loggedUserHandler.getOnlineUsers();
    }

    @RequestMapping(value="/app/logout", method = RequestMethod.GET)
    public ModelAndView logoutPage (HttpServletRequest request, HttpServletResponse response,  ModelAndView modelAndView,
                              final RedirectAttributes redirectAttributes) {
        CookieClearingLogoutHandler cookieClearingLogoutHandler = new CookieClearingLogoutHandler(AbstractRememberMeServices.SPRING_SECURITY_REMEMBER_ME_COOKIE_KEY);
        SecurityContextLogoutHandler securityContextLogoutHandler = new SecurityContextLogoutHandler();
        cookieClearingLogoutHandler.logout(request, response, null);
        securityContextLogoutHandler.logout(request, response, null);
        this.messenger.pushInfoImpl("/welcome/onlineUsers", this.loggedUserHandler.getOnlineUsers());
        redirectAttributes.addFlashAttribute("logout", "display");
        modelAndView.setViewName("redirect:login");
        return modelAndView;
    }

    @Autowired
    public void setLoggedUserHandler(LoggedUserHandler loggedUserHandler) {
        this.loggedUserHandler = loggedUserHandler;
    }
}
