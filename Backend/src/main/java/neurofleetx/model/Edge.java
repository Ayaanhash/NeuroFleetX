package com.neurofleetx.model;

public class Edge {
    private Node from;
    private Node to;
    private int weight; // distance / time / cost

    public Edge(Node from, Node to, int weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }

    public Node getTo() {
        return to;
    }

    public int getWeight() {
        return weight;
    }
}
