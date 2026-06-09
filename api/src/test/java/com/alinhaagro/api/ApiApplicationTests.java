package com.alinhaagro.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.flyway.enabled=false",
        "jwt.secret=test_secret_minimum_256_bits_for_hs256_algorithm_placeholder",
        "jwt.access-expiration=900",
        "jwt.refresh-expiration=604800",
        "sentry.dsn="
})
class ApiApplicationTests {

    @Test
    void contextLoads() {
    }
}