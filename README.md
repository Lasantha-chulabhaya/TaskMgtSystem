Name           -  G.H.M.Lasantha Chulabaya
Project Status -  All the required functionalities in the Assignment are 
                  working perfectly. Including Reset Password(Email)
	
		  

Here is how to setup the back end server

Technology Stack - if you change versions there may be errors
Java           - 11
Backend        - Spring Boot 2.7.7
Database       - MySQL - 8.0 (MySQL57Dialect)
Security       - Spring Security with JWT
Email          - Spring Boot Mail with Gmail SMTP
Documentation  - Swagger/OpenAPI 2.9.2
Build Tool     - Maven 3.6+
IDE (IntelliJ IDEA)


Include this in application properties - change values to your system

# Application Configuration
spring.application.name=UserTask
server.port=8082

# Database Configuration
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/testdb?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL57Dialect
spring.jpa.generate-ddl=true
spring.jpa.show-sql=true

# Path Matching Strategy
spring.mvc.pathmatch.matching-strategy=ANT_PATH_MATCHER
spring.main.allow-circular-references=true

# Email Configuration (Gmail)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=3000
spring.mail.properties.mail.smtp.writetimeout=5000

# Password Reset Configuration
app.password-reset.token-validity-minutes=15
app.password-reset.base-url=http://localhost:5173

# JWT Configuration
jwt.secret=YOUR_JWT_SECRET_KEY
jwt.expiration=86400


pom.xml  -  spring-boot-starter-security
	    jjwt (0.9.1)
            spring-boot-starter-mail
            lombok
            modelmapper - not use because of a version error
            spring-boot-starter-thymeleaf
            hibernate-types-5
            springfox-swagger2 + swagger-ui




Set up front end 


Prerequisites - Node.js 16.0+ 

Update the backend URL in src/services/apiService.js if your backend 
runs on a different port.(my port is 8082)

Install Dependencies          - run npm install
Start the Development Server  - npm run dev

UI & Styling   - Ant Design (5.26.4) - UI component library
               - @emotion/styled (11.14.1) 


HTTP & Data Handling / dev dependencies 

Axios (1.10.0) - HTTP client for API requests
JWT Decode (4.0.0) - JWT token decoding utility
Moment.js (2.30.1) - Date and time manipulation
Vite (7.0.0)

		

