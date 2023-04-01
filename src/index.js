const RootDOM = document.getElementById('root'),
App = {
  projects: (() => {
    if (localStorage.projects === undefined) {
      localStorage.setItem("projects","[]")
    }
      return JSON.parse(localStorage.projects)
    })() 
},
MainMenu = {
  DOMElement: (() => {
    let element = document.createElement("div");
    element.classList.add("fillscreen");
    element.classList.add("main-menu");
    return element;
  })(),
  splashes: [
    "Hi!",
    "Hello!",
    "How are you?!",
    "What a fresh start for stress!",
    "Did you know that each control's property object is transformed to a C++ interface instance, rather than a class?",
    "1.525px for mobile devices!",
    "px/1.525!",
    "Color and alpha values are percentages of 255 divided by 100!",
    "Goodbye in a few months!",
    "\"allow_debug_missing_texture\"!",
    "\"gradient_direction\"!",
    "Pressing over a button/toggle will mute any sound that is set as its \"sound_name\" value, then re-play it again, even if the volume is changed!"
  ],
  Display() {
    RootDOM.appendChild(MainMenu.DOMElement)
  },
  Hide() {
    RootDOM.removeChild(MainMenu.DOMElement)
  }
},
MainMenuElements = {
   welcomeText: (() => {
    let element = document.createElement("div");
    element.classList.add("welcome-text");
    element.onmouseover = () => {
      let currentText = MainMenu.splashes[Math.floor(Math.random() * MainMenu.splashes.length)];
      element.innerText = currentText;
      element.style.color = "yellow";
      element.style.fontSize = Math.min(Math.max(10,24-currentText.length/3),30)+"px";
    };
    element.onclick = () => {
      let currentText = MainMenu.splashes[Math.floor(Math.random() * MainMenu.splashes.length)];
      element.innerText = currentText;
      element.style.fontSize = Math.min(Math.max(10,24-currentText.length/3),30)+"px";
    };
    element.onmouseleave = () => {
      element.style.color = "white";
      element.innerText = "Welcome!"
      element.style.fontSize = "24px";
    }
    element.innerText = "Welcome!"
    MainMenu.DOMElement.appendChild(element);
    return element;
   })(),
   projectsText: (() => {
    let element = document.createElement("div");
    element.classList.add("label");
    element.innerText = "Projects"
    MainMenu.DOMElement.appendChild(element);
    return element;
   })(),
   projectScroll: (() => {
     let element = document.createElement('div');
     element.classList.add("project-container");
     MainMenu.DOMElement.appendChild(element);
     return element;
   })(),
   addProjectElement: (() => {
    let element = document.createElement("button");
    element.innerText = "Create new project!";
    element.classList.add("add-project-button");
    element.onclick = addProject;
    MainMenuElements.projectScroll.appendChild(element)
  }),
  copyright: (() => {
    let element = document.createElement("div");
    element.innerText = "©Bluemond - All rights reserved."
    element.classList.add("copyright");
    MainMenu.DOMElement.appendChild(element);
    return element;
  })(),
  warning: (() => {
    let element = document.createElement("div");
    element.innerText = "Do not re-distribute!"
    element.classList.add("warning");
    MainMenu.DOMElement.appendChild(element);
    return element;
  })()
}
App.projects.forEach((so, i) => {
  let element = document.createElement("button");
  element.innerText = so.name;
  element.editorProjectIndex = i;
  element.classList.add("project-element");
  element.onclick = () => {
    EditorScreen.index = element.editorProjectIndex;
    enterProject(element.editorProjectIndex)
  };
  MainMenuElements.projectScroll.appendChild(element);
})
MainMenuElements.addProjectElement();

const AddProjectScreen = {
  DOMElement: (() => {
    let element = document.createElement("div");
    element.classList.add("fillscreen");
    element.classList.add("add-project-screen");
    return element;
  })(),
  templates: [
    "start_screen",
    "progress_screen"
  ],
  Display() {
    RootDOM.appendChild(AddProjectScreen.DOMElement);
  },
  Hide() {
    RootDOM.removeChild(AddProjectScreen.DOMElement);
  }
},
AddProjectScreenElements = {
  header: (() => {
    let element = document.createElement("div");
    element.innerText = "Create new project:";
    element.classList.add("add-header");
    AddProjectScreen.DOMElement.appendChild(element);
    return element;
  })(),
  nameInput: (() => {
    let element = document.createElement("input");
    element.type = "text";
    element.classList.add("add-control");
    element.classList.add("add-input");
    element.placeholder = "Name";
    AddProjectScreen.DOMElement.appendChild(element);
    return element;
  })(),
  template: (() => {
    const element = document.createElement("select");
    element.classList.add("add-control","add-dropdown");
    AddProjectScreen.templates.forEach((name) => {
      const option = document.createElement("option");
      option.innerText = name;
      element.appendChild(option);
    })
    AddProjectScreen.DOMElement.appendChild(element);
    return element;
  })(),
  addProjectButton() {
    const element = document.createElement("button");
    element.classList.add("add-control","add-button");
    element.onclick = () => {
      App.projects.push({
        "name": (() => {
          if (AddProjectScreenElements.nameInput.value === "") {
            return App.projects.length.toString();
          } else {
            return AddProjectScreenElements.nameInput.value
          }
        })(),
        "template": AddProjectScreenElements.template.selectedOptions[0].label,
        "data": `{
          //UI data starts here
        }`
      });
      localStorage.projects = JSON.stringify(App.projects);
      enterProject(App.projects.length-1);
    }
    element.innerText = "Create!";
    AddProjectScreen.DOMElement.appendChild(element);
    return element;
  }
}
AddProjectScreenElements.addProjectButton();

function addProject(){
  MainMenu.Hide();
  AddProjectScreen.Display();
}

function enterProject(index){
  RootDOM.innerHTML = "";
  EditorScreen.Load(index);
  EditorScreen.Display();
}

//-------------------------------
// Editor
//-------------------------------

const EditorScreen = {
  DOMElement: (() => {
    const element = document.createElement("div");
    element.classList.add("fillscreen","editor-screen");
    return element;
  })(),
  index: 0,
  Display() {
    RootDOM.appendChild(EditorScreen.DOMElement);
  },
  Hide() {
    RootDOM.removeChild(EditorScreen.DOMElement);
  },
  Load(i) {
    EditorScreen.DOMElement.innerHTML = "";
    const header = document.createElement("div");
    header.classList.add("editor-header");
    EditorScreen.DOMElement.appendChild(header);
    const codeContainer = document.createElement("div");
    codeContainer.classList.add("editor-code-container");
    EditorScreen.DOMElement.appendChild(codeContainer);
    const codeLines = document.createElement("div");
    codeLines.classList.add("editor-code-lines-list");
    codeContainer.appendChild(codeLines);
    const codeEditor = document.createElement("div");
    codeEditor.contentEditable = true;
    codeEditor.classList.add("editor-code-input");
    codeEditor.innerText = (App.projects[i].data !== undefined) ? App.projects[i].data : "";
    codeContainer.appendChild(codeEditor);
    const saveButton = document.createElement("button");
    saveButton.classList.add("editor-save-button","editor-header-button");
    saveButton.onclick = () => {
      App.projects[i].data = codeEditor.innerText;
      localStorage.projects = JSON.stringify(App.projects);
      console.log("test")
    }
    header.appendChild(saveButton)
    const exitButton = document.createElement("button");
    exitButton.classList.add("editor-header-button","editor-exit-button");
    exitButton.onclick = () => {
      EditorScreen.Hide();
      MainMenu.Display();
    }
    header.appendChild(exitButton)
  }
}
window.addEventListener("load",() => {
  MainMenu.Display();
})