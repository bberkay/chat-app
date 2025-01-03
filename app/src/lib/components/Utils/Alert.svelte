<script lang="ts">
    interface Props {
        message: string;
    }

    let { message }: Props = $props();
</script>

<div class="alert">
    <div class="message">
        <div style="margin-right:7px;margin-top:1px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" style="fill: var(--info-text-color);"  viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path></svg>
        </div>
        <span>{message}</span>
    </div>
    <button onclick={() => {document.querySelector('.alert')?.remove()}}>X</button>
</div>

<style>
    .alert{
        background-color: var(--info-bg-color);
        padding: 0.5rem 0.7rem 0.3rem 0.7rem;
        color: var(--info-text-color);
        border: 1px solid var(--info-border-color);
        font-size: 0.85em;
        display:flex;
        justify-content:space-between;
        align-items: center;

        & .message{
            display:flex;
            align-items:center;
        }

        & button{
            background-color: transparent;
            border: transparent;
            border-radius: 50%;
            cursor: pointer;
            color: var(--info-text-color);
            padding:2px 5px 2px 6px;
            font-size: 0.9em;
            font-weight: bold;
            margin-top:-2px;

            &:hover{
                opacity:0.9;
            }

            &:active{
                opacity:0.7;
            }
        }
    }
</style>
