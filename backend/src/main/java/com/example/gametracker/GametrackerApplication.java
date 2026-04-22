package com.example.gametracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class GametrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(GametrackerApplication.class, args);
	}

}
