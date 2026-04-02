import { Position, Handle } from "@xyflow/react";

// custom node 설정
export const ImageNode = (props: any) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            borderRadius: "20%",
            backgroundColor: "#000",
            border: "2px solid #fff",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={props.data.imageUrl}
            alt={props.data.label}
            style={{
              width: "24px",
              height: "24px",
              objectFit: "cover",
            }}
          />
        </div>
        {props.data.label != "트리거" && (
          <Handle type="target" position={Position.Left} />
        )}

        {props.data.category === "condition" ? (
          <>
            <Handle
              type="source"
              position={Position.Right}
              id="true"
              style={{ top: "25%" }}
            />
            <Handle
              type="source"
              position={Position.Right}
              id="false"
              style={{ top: "75%" }}
            />
            <span
              style={{
                backgroundColor: "#808080",
                padding: "0px 2px",
                borderRadius: "20%",
                position: "absolute",
                right: "-25px",
                top: "12%",
                fontSize: "8px",
                color: "#BEBEBE",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              true
            </span>
            <span
              style={{
                backgroundColor: "#808080",
                padding: "0px 2px",
                borderRadius: "20%",
                position: "absolute",
                right: "-28px",
                top: "63%",
                fontSize: "8px",
                color: "#BEBEBE",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              false
            </span>
          </>
        ) : (
          <Handle type="source" position={Position.Right} />
        )}
      </div>
      <div
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: "9px",
          whiteSpace: "nowrap",
        }}
      >
        {props.data.label}
      </div>
    </div>
  );
};

export const initialNodes = [
  {
    id: "manual_trigger-node",
    type: "imageNode",
    // category: "manual",
    // position: { x: 0, y: 0 },
    data: {
      label: "트리거",
      imageUrl: "nodeImages/touch_app.svg",
      // category: "manual",
    },
  },
  {
    id: "search_node",
    type: "imageNode",
    // category: "azure_search",
    // position: { x: 100, y: 0 },
    data: {
      label: "Azure Search",
      imageUrl: "nodeImages/document_search.svg",
    },
  },
  {
    id: "generate_answer",
    type: "imageNode",
    // category: "llm_call",
    // position: { x: 200, y: 0 },
    data: {
      label: "Agent 답변 생성",
      imageUrl: "nodeImages/chat.svg",
    },
  },
  {
    id: "write_notion",
    type: "imageNode",
    // category: "autonomous_agent",
    // position: { x: 300, y: 0 },
    data: {
      label: "노션 작성",
      imageUrl: "nodeImages/edit.svg",
    },
  },
  {
    id: "condition",
    type: "imageNode",
    data: {
      label: "if/else",
      imageUrl: "nodeImages/call_split.svg",
      category: "condition",
    },
  },
];
