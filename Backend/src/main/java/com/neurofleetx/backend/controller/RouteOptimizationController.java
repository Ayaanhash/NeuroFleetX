package com.neurofleetx.backend.controller;

import com.neurofleetx.backend.service.RouteOptimizationService;
import com.neurofleetx.backend.graph.Node;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/route")
@CrossOrigin(origins = "http://localhost:3000")
public class RouteOptimizationController {

    private final RouteOptimizationService service;

    public RouteOptimizationController(RouteOptimizationService service) {
        this.service = service;
    }

    @GetMapping("/optimize")
    public Map<String, Integer> optimize(@RequestParam String start) {

        Node startNode = new Node(start);
        Map<Node, Integer> result = service.optimizeRoute(startNode);

        // Convert Node -> String for React
        Map<String, Integer> response = new HashMap<>();
        result.forEach((node, distance) ->
            response.put(node.getName(), distance)
        );

        return response;
    }
}
