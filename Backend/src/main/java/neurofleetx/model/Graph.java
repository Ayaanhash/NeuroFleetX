package com.neurofleetx.model;

import java.util.*;

public class Graph {
    private Map<Node, List<Edge>> adjList = new HashMap<>();

    public void addNode(Node node) {
        adjList.putIfAbsent(node, new ArrayList<>());
    }

    public void addEdge(Node from, Node to, int weight) {
        adjList.get(from).add(new Edge(from, to, weight));
    }

    public Map<Node, List<Edge>> getAdjList() {
        return adjList;
    }
}
