FROM tomcat:7.0.104-jdk8
MAINTAINER Manuel Morillo <manueljmorillo@guadaltel.com>

ADD mapea.war /usr/local/tomcat/webapps/mapea5.war

COPY ./cacerts /usr/lib/jvm/java-1.7.0-openjdk-amd64/jre/lib/security/cacerts

EXPOSE 8080
