package com.example.OnlineChatApp.Configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
// Switch off the Spring Boot security configuration
//@EnableWebSecurity
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.authorizeRequests()
//                .antMatchers("/resources/static/**/**").permitAll()
                .antMatchers("/images/**").permitAll()
                .antMatchers("/css/**").permitAll()
                .antMatchers("/app/sign-up").permitAll()
                .antMatchers("/js/**").permitAll()
//                .antMatchers("/app/login**").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .loginPage("/app/login").permitAll()
                .defaultSuccessUrl("/app/messenger", true)
                .permitAll()
                .and()
                .csrf().disable()
                .httpBasic();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {

        auth.inMemoryAuthentication()
                .withUser("user").password("{noop}123").roles("USER")
                .and()
                .withUser("admin").password("{noop}123").roles("ADMIN")
                .and()
                .withUser("admin1").password("{noop}123").roles("ADMIN");
    }

}
