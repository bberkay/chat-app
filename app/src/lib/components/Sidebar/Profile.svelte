<script lang="ts">
    import type { User } from "$lib/types";
    import { sessionIdStore } from "$lib/stores";
    import { afterUpdate, onMount } from "svelte";
    import { get } from "svelte/store"

    export let user: User;
    let isSessionModalActive = false;

    // Get all session modal elements
    let sessionModal: HTMLElement, sessionIdInput: HTMLInputElement;
    onMount(() => {
        sessionModal = document.getElementById("session-modal")!;
        sessionIdInput = document.getElementById("session-id") as HTMLInputElement;

        // Add copy event listener
        document.getElementById("copy-session-id")!.addEventListener("click", () => {
            sessionIdInput.select();
            sessionIdInput.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(sessionIdInput.value);
        });

        // Add save event listener
        document.getElementById("save-session-id")!.addEventListener("click", async () => {
            if(sessionIdInput.value.length === 24) {
                const response = await fetch(`/api/session/save?id=${sessionIdInput.value}`);
                const data = await response.text();
                if(data !== "false"){
                    (sessionModal.querySelector(".session-modal-alert.success") as HTMLElement).style.display = "flex";
                    sessionIdStore.set(sessionIdInput.value);
                }
                else (sessionModal.querySelector(".session-modal-alert.error") as HTMLElement).style.display = "flex";
            }
        });

        // Add open event listener
        document.getElementById("toggle-session-modal")!.addEventListener("click", () => {
            isSessionModalActive = !isSessionModalActive;
            sessionModal.style.opacity = isSessionModalActive ? "1" : "0";
            sessionModal.style.pointerEvents = isSessionModalActive ? "all" : "none";
        });

        // Add toggle event listener
        document.addEventListener("click", (e) => {
            if(!isSessionModalActive) return;
            if(sessionModal.contains(e.target as Node) || document.getElementById("toggle-session-modal")!.contains(e.target as Node)) return;
            isSessionModalActive = false;
            sessionModal.style.opacity = "0";
            sessionModal.style.pointerEvents = "none";
        });
    });

    // Update session id on change
    afterUpdate(() => {
        sessionIdInput.value = get(sessionIdStore);
    });
</script>

<div id="profile-card-container">
    <div id = "session-modal" style="opacity:0">
        <div class = "session-modal-alert info">
            <div style="margin-right:10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" style="fill: var(--info-text-color);"  viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path></svg>
            </div>
            <div>
                <small>This is your session id and this is only available for live demo. You can copy this session id and paste it in another browser to chat with yourself.</small>
            </div>
        </div>
        <div class = "session-modal-alert error" style="align-items:center;display:none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" style="fill: var(--error-text-color);" viewBox="0 0 256 256"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"></path></svg>
            <small style="margin-left:10px;">Invalid Session ID</small>
        </div>
        <div class = "session-modal-alert success" style="align-items:center;display:none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" style="fill: var(--success-text-color);" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>
            <small style="margin-left:10px;">Session ID Changed</small>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;">
            <input type="text" id="session-id" minlength="24" maxlength="24">
            <button id = "copy-session-id">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path></svg>
            </button>
            <span class = "gap"></span>
            <button id = "save-session-id">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
            </button>
        </div>
    </div>
    <div id = "profile-card">
        <div id = "profile-info">
            <img src="{user.avatar}" alt="">
            <span><b>{user.name}</b><br><small><i>My Profile</i></small></span>
        </div>
        <div id="profile-buttons">
            <button type="button" id = "toggle-session-modal">
                {#if !isSessionModalActive}
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" style="--darkreader-inline-fill: #000000;" data-darkreader-inline-fill=""><path d="M160,16A80.07,80.07,0,0,0,83.91,120.78L26.34,178.34A8,8,0,0,0,24,184v40a8,8,0,0,0,8,8H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A80,80,0,1,0,160,16Zm0,144a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A64,64,0,1,1,160,160Zm32-84a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path></svg>                
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" style="--darkreader-inline-fill: #000000;" data-darkreader-inline-fill=""><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                {/if}
            </button>
        </div>
    </div>
</div>

<style>
    #profile-card-container{
        position:absolute;
        bottom:0;
        width:100%;
    }

    #profile-card{
        display:flex;
        align-items:center;
        justify-content: space-between;
        cursor:pointer;
        margin-top:-3px;
        border-top:2px solid var(--border-color);
        color:var(--text-color);
        padding:1rem;
        background-color:var(--front-color);
    }

    #profile-buttons{
        display:flex;
        align-items:center;
    }

    #profile-card-container span.gap{
        margin:0 0.5rem;
        border-left:1px solid var(--border-color);
        height:1.5em;
        filter:invert(0.1);
    }

    #profile-card #profile-info{
        display:flex;
        align-items:center;
    }

    #profile-card img{
        margin-right:1rem;
        border-radius: 50%;
        width:3em;
        height:3em;
    }

    #profile-card-container button{
        padding:0.4rem 0.4rem 0.2rem 0.4rem;
        border:1px solid var(--border-color);
        background-color:var(--front-bright-color);
        border-radius:5px;
        cursor:pointer;
    }

    #profile-card-container button{
        padding:0.5rem 0.5rem 0.3rem 0.5rem;
        background-color: var(--accent-color);
    }

    #profile-card-container a svg, #profile-card-container button svg{
        color:var(--text-color);
        width:1.5em;
        height:1.5em;
    }

    #profile-card-container button:hover{
        opacity:0.7;
    }

    #profile-card-container button:active{
        opacity:0.5;
    }

    #profile-buttons button:first-child svg{
        color: white!important;
    }

    #session-modal{
        padding: 1em;
    }

    #session-modal input{
        width: 20em;
        padding: 0.85em;
        border: 1px solid var(--border-color);
        border-radius: 5px;
        margin-right: 1em;
    }

    #session-modal button{
        padding: 0.6em;
        border: 1px solid var(--border-color);
        border-radius: 5px;
        background-color: var(--front-bright-color);
        cursor: pointer;
    }

    #session-modal svg{
        color: var(--text-color);
    }

    #session-modal .session-modal-alert{
        display:flex;
        padding: 0.8em;
        background-color: var(--info-color);
        color: var(--info-text-color);
        border-radius: 5px;
        border: 1px solid var(--info-border-color);
        margin:1em 0.2em 1em 0.2em;
    }

    #session-modal .session-modal-alert.error{
        background-color: var(--error-color);
        color: var(--error-text-color);
        border: 1px solid var(--error-border-color);
    }

    #session-modal .session-modal-alert.success{
        background-color: var(--success-color);
        color: var(--success-text-color);
        border: 1px solid var(--success-border-color);
    }
</style>