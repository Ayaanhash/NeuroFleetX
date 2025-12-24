package com.neurofleetx.dto;

public class RouteRequest {

    private String source;
    private String destination;

    // Default constructor (important for Spring)
    public RouteRequest() {}

    public RouteRequest(String source, String destination) {
        this.source = source;
        this.destination = destination;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }
}
