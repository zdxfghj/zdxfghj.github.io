
function IMCECustomSendByClass(File, win) {
    let imce = win.imce;
    let field = document.querySelector('.' + imce.getQuery('ck_classname') + ' input.cke_dialog_ui_input_text');
    if (!field) {
        field = document.querySelector('.' + imce.getQuery('ck_classname') + ' textarea.cke_dialog_ui_input_textarea');
    }

    if (!field) {
        win.close();
        return;
    }

    let selection = imce.getSelection();
    let i;
    let lines = [];
    for (i in selection) {
        if (!imce.owns(selection, i)) {
            continue;
        }
        File = selection[i];
        lines.push(File.getUrl());
    }
    field.value = lines.join('');
    win.close();
}