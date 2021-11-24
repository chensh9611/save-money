<template>
  <div class="numberPad-wrapper">
    <div class="money">{{output}}</div>
    <div class="buttons" @click="touchstart">
      <section @click="getButton">
        <button :class="longLock === true && this.text==='7' && 'clickBackground'">7</button>
        <button :class="longLock === true && this.text==='8' && 'clickBackground'">8</button>
        <button :class="longLock === true && this.text==='9' && 'clickBackground'">9</button>
        <button :class="longLock === true && this.text==='清零' && 'clickBackground'">清零</button>
        <button :class="longLock === true && this.text==='4' && 'clickBackground'">4</button>
        <button :class="longLock === true && this.text==='5' && 'clickBackground'">5</button>
        <button :class="longLock === true && this.text==='6' && 'clickBackground'">6</button>
        <button :class="longLock === true && this.text==='+' && 'clickBackground'">+</button>
        <button :class="longLock === true && this.text==='1' && 'clickBackground'">1</button>
        <button :class="longLock === true && this.text==='2' && 'clickBackground'">2</button>
        <button :class="longLock === true && this.text==='3' && 'clickBackground'">3</button>
        <button :class="longLock === true && this.text==='-' && 'clickBackground'">-</button>
        <button :class="longLock === true && this.text==='.' && 'clickBackground'">.</button>
        <button :class="longLock === true && this.text==='0' && 'clickBackground'">0</button>
        <button :class="longLock === true && this.text==='删除' && 'clickBackground'">删除</button>
        <button class="complete" :class="longLock === true && this.text==='完成'||'=' && 'clickBackground'">{{result}}</button>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import generateOutput from '@/lib/generateOutput';
@Component
export default class NumberPadSection extends Vue {
  @Prop(Number) amount!: number;
  output = this.amount.toString();
  text = '';
  longLock = false;
  touchstart(event: MouseEvent) {
    this.text = ((event.target as HTMLButtonElement).textContent!.trim() as string);
    this.longLock = true;
    clearTimeout(0);
     setTimeout(() => {
      this.longLock = false;
    }, 100);
  }

  get result() {
    return this.output.indexOf('+') >= 0 || this.output.indexOf('-') >= 0 ? '=' : '完成';
  }

  getButton(event: MouseEvent) {
    const text = (event.target as HTMLButtonElement).textContent;
    if (text === null) return;
    this.output = generateOutput(text, this.output);
    if (this.output.indexOf('.')>=0 && text === '.'){return;}
    this.$emit('update:value', parseFloat(this.output));
    if(text === '完成'){
      this.$emit('onSubmit')
      this.output = '0'
    }
  }
}
</script>

<style lang="scss" scoped>
.numberPad-wrapper {
  position: relative;
  .money {
    position: absolute;
    top: -61px;
    right: 15px;
    font-weight: 400;
    font-size: 20px;
  }
  .buttons {
    > section {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;

      > button {
        background-color: #F3F3F3;
        font-size: 18px;
        width: 25%;
        height: 48px;
        border: 0.2px solid #dadbdd;
        &.clickBackground {
          background: darkgrey;
        }
        &.complete {
          background-color: #9d81ea;
          border: 1px solid #9d81ea;
        }
      }
    }
  }


}
</style>