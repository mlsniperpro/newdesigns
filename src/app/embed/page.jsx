"use client";

import { auth } from "@/config/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo, useReducer, useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

const initialState = {
  selectedFields: {},
  textInputFields: {
    firstMessage: "",
    inputPlaceholder: "",
    chatName: "",
    supportLabel: "Live Support",
    supportOption: "",
    supportContact: "", // Can be a phone number or a URL
  },
  editableLabels: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    submit: "Submit",
    support: "Support",
  },
  systemPrompt: "",
  temperature: 0.5,
  supportType: null, // 'whatsapp', 'telegram', or 'custom'
};

const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SELECTED_FIELD":
      const currentSelectedFields = { ...state.selectedFields };
      if (currentSelectedFields[action.payload.name]) {
        delete currentSelectedFields[action.payload.name];
      } else {
        currentSelectedFields[action.payload.name] =
          state.editableLabels[action.payload.name];
      }
      return {
        ...state,
        selectedFields: currentSelectedFields,
      };
    case "SET_TEXT_INPUT_FIELD":
      return {
        ...state,
        textInputFields: {
          ...state.textInputFields,
          [action.payload.name]: action.payload.value,
        },
      };
    case "SET_EDITABLE_LABEL":
      return {
        ...state,
        editableLabels: {
          ...state.editableLabels,
          [action.payload.name]: action.payload.value,
        },
      };
    case "SET_SYSTEM_PROMPT":
      return {
        ...state,
        systemPrompt: action.payload,
      };
    case "SET_TEMPERATURE":
      return {
        ...state,
        temperature: action.payload,
      };
    case "SET_SUPPORT_TYPE":
      return {
        ...state,
        supportType: action.payload,
        textInputFields: {
          ...state.textInputFields,
          // Reset supportContact when changing support type
          supportContact: "",
        },
      };
    case "SET_SUPPORT_CONTACT":
      return {
        ...state,
        textInputFields: {
          ...state.textInputFields,
          supportContact: action.payload,
        },
      };
    case "SET_CUSTOM_SUPPORT_URL":
      return {
        ...state,
        textInputFields: {
          ...state.textInputFields,
          customSupportUrl: action.payload,
        },
      };
    default:
      return state;
  }
};

const CodeSnippetComponent = ({ theme = "light" }) => {
  const router = useRouter();
  const { fileName } = router.query;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedScript, setSelectedScript] = useState("chatWidget.js");

  const isDarkTheme = useMemo(() => theme === "dark", [theme]);
  const textColorClass = useMemo(
    () => (isDarkTheme ? "text-white" : "text-black"),
    [isDarkTheme]
  );

  const toggleScript = () => {
    const newScript =
      selectedScript === "chatWidget.js"
        ? "chatWidgetIframe.js"
        : "chatWidget.js";
    setSelectedScript(newScript);
    toast.success(
      `Mode switched to ${
        newScript === "chatWidget.js" ? "Script Injection" : "Iframe"
      } mode`
    );
  };

  const generateCodeSnippet = useMemo(() => {
    const vionikoaiChat = {
      userId: auth.currentUser.uid,
      fileName,
      systemPrompt: state.systemPrompt,
      temperature: state.temperature.toFixed(1),
      supportType: state.supportType,
      customSupportUrl: state.textInputFields.customSupportUrl,
      supportContact: state.textInputFields.supportContact,
      ...state.selectedFields,
      ...state.textInputFields,
    };
    return `<script type="application/javascript">window.vionikoaiChat = ${JSON.stringify(
      vionikoaiChat,
      null,
      2
    )};(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s);js.id = id;js.async = true;js.src = "https://mlsniperpro.github.io/vionikoaichatbox/client/${selectedScript}";fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'vionikoaiChat-jssdk'));</script>`;
  }, [state, fileName, selectedScript]);

  const handleCheckboxChange = (e) => {
    const { name } = e.target;
    dispatch({
      type: "TOGGLE_SELECTED_FIELD",
      payload: { name },
    });
  };

  const handleTextInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "SET_TEXT_INPUT_FIELD",
      payload: { name, value },
    });
  };

  const handleLabelChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "SET_EDITABLE_LABEL",
      payload: { name, value },
    });
  };

  const handleSystemPromptChange = (e) => {
    dispatch({
      type: "SET_SYSTEM_PROMPT",
      payload: e.target.value,
    });
  };

  const handleTemperatureChange = (e) => {
    dispatch({
      type: "SET_TEMPERATURE",
      payload: parseFloat(e.target.value),
    });
  };

  const handleSupportTypeChange = (e) => {
    dispatch({
      type: "SET_SUPPORT_TYPE",
      payload: e.target.value,
    });
  };

  const handleSupportContactChange = (e) => {
    dispatch({
      type: "SET_SUPPORT_CONTACT",
      payload: e.target.value,
    });
  };

  const handleCustomSupportUrlChange = (e) => {
    dispatch({
      type: "SET_CUSTOM_SUPPORT_URL",
      payload: e.target.value,
    });
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCodeSnippet);
      toast.success("Code copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  if (!fileName) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`flex mt-50 flex-col justify-center items-center h-screen ${textColorClass}`}
    >
      <div
        className={`prose prose-sm ${textColorClass} p-4 rounded-lg shadow-md bg-white`}
      >
        <ReactMarkdown>{`\`\`\`javascript\n${generateCodeSnippet}\n\`\`\``}</ReactMarkdown>
        <button
          onClick={handleCopyToClipboard}
          className="mt-4 p-2 bg-blue-500 text-white rounded-md"
        >
          Copy to Clipboard
        </button>
        <button
          onClick={toggleScript}
          className="mt-4 p-2 bg-green-500 text-white rounded-md"
        >
          Toggle Script
        </button>
        <div className="mt-4 flex flex-col">
          <div className="flex flex-col bg-gray-100 p-2 rounded-md">
            <span className="font-bold mb-2">Select Fields:</span>
            {["name", "email", "phone", "submit"].map((field) => (
              <label key={field} className="flex items-center">
                <input
                  type="checkbox"
                  name={field}
                  checked={!!state.selectedFields[field]}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <input
                  type="text"
                  name={field}
                  value={state.editableLabels[field]}
                  onChange={handleLabelChange}
                  className="p-2 border rounded-md"
                />
              </label>
            ))}
          </div>
          <div className="flex flex-col bg-gray-100 p-2 rounded-md mt-4">
            <span className="font-bold mb-2">Text Inputs:</span>
            {[
              "firstMessage",
              "inputPlaceholder",
              "chatName",
              "supportLabel",
            ].map((field) => (
              <label key={field} className="flex flex-col mb-2">
                {field}
                <input
                  type="text"
                  name={field}
                  value={state.textInputFields[field]}
                  onChange={handleTextInputChange}
                  className="p-2 border rounded-md"
                />
              </label>
            ))}
          </div>
          <div className="flex flex-col bg-gray-100 p-2 rounded-md mt-4">
            <label className="font-bold mb-2">System Prompt:</label>
            <textarea
              value={state.systemPrompt}
              onChange={handleSystemPromptChange}
              className="p-2 border rounded-md"
              rows="4"
            ></textarea>
            <label className="font-bold mb-2 mt-4">Temperature:</label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.temperature}
                onChange={handleTemperatureChange}
                className="w-full"
              />
              <span className="ml-2">{state.temperature.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-gray-100 p-2 rounded-md mt-4">
          <span className="font-bold mb-2">Support Options:</span>
          <select
            value={state.supportType}
            onChange={handleSupportTypeChange}
            className="p-2 border rounded-md mb-2"
          >
            <option value="">Select Support Type</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="custom">Custom</option>
          </select>
          {state.supportType === "whatsapp" ||
          state.supportType === "telegram" ? (
            <input
              type="tel"
              placeholder={`Enter ${state.supportType} phone number`}
              value={state.textInputFields.supportContact}
              onChange={handleSupportContactChange}
              className="p-2 border rounded-md"
            />
          ) : state.supportType === "custom" ? (
            <input
              type="url"
              placeholder="Enter custom support URL"
              value={state.textInputFields.supportContact}
              onChange={handleSupportContactChange}
              className="p-2 border rounded-md"
            />
          ) : null}
        </div>
      </div>
      <div className="mt-4">
        <Link href="/pdf">
          <span className={`underline ${textColorClass}`}>Back to PDF</span>
        </Link>
      </div>
    </div>
  );
};

export default CodeSnippetComponent;
