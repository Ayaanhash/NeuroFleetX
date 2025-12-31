package com.neurofleetx.backend.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.neurofleetx.backend.algorithm.DijkstraAlgorithm;
import com.neurofleetx.backend.graph.Graph;
import com.neurofleetx.backend.graph.Node;

@Service
public class RouteOptimizationService {

    public Map<Node, Integer> optimizeRoute(Node start) {

        Graph graph = new Graph();

        Node A = new Node("A");
        Node B = new Node("B");
        Node C = new Node("C");

        graph.addNode(A);
        graph.addNode(B);
        graph.addNode(C);

        graph.addEdge(A, B, 5);
        graph.addEdge(B, C, 3);
        graph.addEdge(A, C, 10);

        return DijkstraAlgorithm.findShortestPath(graph, start);
    }
}
