# Steps To Start

1. first to install the project dependencies run: `npm install`.
2. After that, To start a dev server `ng serve`.
3. Navigate to `http://localhost:4200/` 

# Components
1. Main Screen: it has option to select the pin position of the dialog and opening the dialog. Choose a pin position for the dialog and then open it.
2. Floating Dialog: It is a draggable dialog. Which can be pinned. The pin position object needs to be passed in the data of the object.

# Services
1. Pin Dialog service: It has a BehaviorSubject to keep track of the latest pinned dialog.

# Model
1. FloatingDialogData: to speify the data required by the dialog component.

# Styles
1. there are some global styles in styles.scss file.