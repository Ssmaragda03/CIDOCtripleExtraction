/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package EntityRecognition;

/**
 *
 * @author smara
 */
public class Entity {

    private Integer id;
    private String label;
    private String type;
    private String uri;
    private String substring;
    private String status;
    private String comment;

    public Entity() {
    }

    public Entity(Integer id, String label, String type, String uri, String substring) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.uri = uri;
        this.substring = substring;
    }

    // Getters / Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getStart() {
        return substring;
    }

    public void setStart(String str) {
        this.substring = str;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

}
