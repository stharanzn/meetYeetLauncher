
window.onload = ()=>{
    document.getElementById("appArea").style.opacity = 1;
    
}

export function popupToast(_message, _status = "info"){
    let popup = `
        <div class="toast ${_status}">${_message}.</div>
        `
        let toasterDiv = document.getElementById('toaster')
        toasterDiv.style.transition = "1s all ease !important"
        toasterDiv.innerHTML = popup;
    setTimeout(() => {
        const elem = document.getElementById('toaster');
        elem.innerHTML = "";
    }, 4000);
    
}
