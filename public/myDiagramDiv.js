let myDiagram;

// Initialize GoJS Diagram
function init() {
    var $ = go.GraphObject.make;

    myDiagram = $(go.Diagram, "myDiagramDiv", {
        "undoManager.isEnabled": true,
        // "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom // Enable zooming with mouse wheel
    });

    // Define Node Template
    myDiagram.nodeTemplate = $(
        go.Node,
        "Auto",
        { click: (e, obj) => nodeClicked(obj) },
        $(go.Shape, "Rectangle", { name: "SHAPE", fill: "white", strokeWidth: 2 }, new go.Binding("fill", "color")),
        $(go.TextBlock, { margin: 5 }, new go.Binding("text", "title"))
    );

    // Link Template
    myDiagram.linkTemplate = $(
        go.Link,
        { routing: go.Link.AvoidsNodes, corner: 5 },
        $(go.Shape, { stroke: "gray", strokeWidth: 1 }, new go.Binding("stroke", "isHighlighted", h => h ? "red" : "gray").ofObject()),
        $(go.Shape, { toArrow: "Standard", stroke: null, fill: "gray" }, new go.Binding("fill", "isHighlighted", h => h ? "red" : "gray").ofObject())
    );

    // Group Template
    myDiagram.groupTemplate = $(
        go.Group,
        "Auto",
        {
            movable: true,
            deletable: false,
            ungroupable: true,
            computesBoundsAfterDrag: true,
            handlesDragDropForMembers: true,
            layout: $(go.GridLayout, { wrappingColumn: 1, spacing: new go.Size(20, 20) }),
            click: (e, group) => highlightConnectedComponents(group)
        },
        $(go.Shape, "RoundedRectangle", { fill: "lightgray" }),
        $(go.Panel, "Vertical",
            $(go.TextBlock, { margin: 5, font: "Bold 12px Sans-Serif" }, new go.Binding("text", "title")),
            $(go.Placeholder, { padding: 10 })
        )
    );
}

// Load JSON from File Input
function loadJSON() {
    const fileInput = document.getElementById("jsonFileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a JSON file!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const jsonData = JSON.parse(event.target.result);
            updateDiagram(jsonData);
        } catch (error) {
            alert("Invalid JSON format!");
        }
    };
    reader.readAsText(file);
}

// Update the Diagram with JSON Data
function updateDiagram(jsonData) {
    myDiagram.model = go.Model.fromJson(jsonData);
}

// Function to Highlight a Node
function highlightNode(obj) {
    let node = obj.part;
    if (node) {
        myDiagram.startTransaction("highlight");
        node.data.color = "red"; // Change fill color
        myDiagram.model.updateTargetBindings(node.data);
        myDiagram.commitTransaction("highlight");
    }
}

// Function to Highlight Connected Components
function highlightConnectedComponents(node) {
    myDiagram.startTransaction("highlight");
    myDiagram.clearHighlighteds();
    node.isHighlighted = true;
    node.findNodesConnected().each(n => n.isHighlighted = true);
    node.findLinksConnected().each(link => link.isHighlighted = true);
    myDiagram.commitTransaction("highlight");
}

// Function to Highlight a Component by Key
function highlightComponent(key) {
    myDiagram.startTransaction("highlight");

    myDiagram.nodes.each(node => {
        var shape = node.findObject("SHAPE");
        if (shape) {
            shape.fill = node.data.key === key ? "lightcoral" : node.data.color || "white";
        }
    });

    myDiagram.commitTransaction("highlight");
}

// Function to Reset All Colors
function resetColors() {
    myDiagram.nodes.each(n => myDiagram.model.set(n.data, "color", "lightgray"));
    myDiagram.links.each(link => link.isHighlighted = false);
}

// Function to Handle Node Click
function nodeClicked(obj) {
    const nodeData = obj.part.data;
    myDiagram.startTransaction("changeColor");
    nodeData.color = nodeData.color === "orange" ? "white" : "orange";  // Toggle color
    myDiagram.model.updateTargetBindings(nodeData);
    myDiagram.commitTransaction("changeColor");
}

// Run init function when the window loads
window.onload = init;
