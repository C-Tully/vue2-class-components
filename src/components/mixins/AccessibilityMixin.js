import { querySelector } from "@/utils/dom";
export default () => {
  return {
    methods: {
      onFilterEnterKeypress(selection) {
        const elementToFocus = this.$refs[`${selection}-selectAll`]
          ? this.$refs[`${selection}-selectAll`]
          : this.$refs[`${selection}Checkbox-0`];

        this.$nextTick(() => {
          elementToFocus[0].focus();
        });
      },
      onUpArrowKeypress(e, key, index, filterLength) {
        e.preventDefault();
        if (index === -1) {
          this.$refs[Object.keys(this.$refs)[filterLength - 1]][0].focus();
          return;
        }

        if (index === 0) {
          const nextFocus = querySelector(this.$el, "#selectAll")
            ? querySelector(this.$el, "#selectAll")
            : querySelector(this.$el, "#criteria-FirstFocus");

          this.$nextTick(() => {
            if (nextFocus) {
              nextFocus.focus();
            }
          });
        } else {
          this.$refs?.[Object.keys(this.$refs)[index - 1]][0].focus();
        }
      },
      onDownArrowKeypress(e, key, index, filterLength) {
        e.preventDefault();
        const checkBoxCount = filterLength;
        if (index === -1) {
          this.$refs[Object.keys(this.$refs)[0]][0].focus();
          return;
        }

        if (index === checkBoxCount - 1) {
          const nextFocus = querySelector(this.$el, "#selectAll")
            ? querySelector(this.$el, "#selectAll")
            : querySelector(this.$el, "#criteria-FirstFocus");

          if (nextFocus) {
            nextFocus.focus();
          }
        } else {
          this.$refs?.[Object.keys(this.$refs)[index + 1]]?.[0]?.focus();
        }
      },
      onDownArrowKeyPressNoSelectAll(e, key, index, filterLength) {
        e.preventDefault();

        const checkBoxCount = filterLength;

        if (index === -1) {
          const arrayLength = this.$refs[`${key}Checkbox-0`]?.length;
          if (arrayLength > 0) {
            this.$refs[`${key}Checkbox-0`][0].focus();
          }
          return;
        }

        if (index === checkBoxCount - 1) {
          this.$refs[`${key}Checkbox-0`][0].focus();
        } else {
          this.$refs?.[`${key}Checkbox-` + (index + 1)]?.[0]?.focus();
        }
      },
      onUpArrowKeypressNoSelectAll(e, key, index, filterLength) {
        e.preventDefault();
        if (index === -1) {
          if (this.$refs[`${key}Checkbox-${filterLength - 1}`]) {
            this.$refs[`${key}Checkbox-${filterLength - 1}`][0].focus();
          }
          return;
        }

        if (index === 0) {
          this.$nextTick(() => {
            this.$refs[`${key}Checkbox-${filterLength - 1}`][0].focus();
          });
        } else {
          this.$refs?.[`${key}Checkbox-` + (index - 1)]?.[0]?.focus();
        }
      },
      onTabKeyPress(e, index, length) {
        const keyName = String(e.key).toLowerCase();
        const isRightArrow = keyName === "arrowright" || keyName === "right";
        const isLeftArrow = keyName === "arrowleft" || keyName === "left";

        if (isRightArrow && index !== length) {
          this.$refs[`tab-${index + 1}`][0].focus();
        } else if (isRightArrow) {
          this.$refs[`tab-0`][0].focus();
        }

        if (isLeftArrow && index === 0) {
          this.$refs[`tab-${length}`][0].focus();
        } else if (isLeftArrow) {
          this.$refs[`tab-${index - 1}`][0].focus();
        }
      },
      announceToScreenReader(message) {
        if (this.$refs && this.$refs.srAnnouncement) {
          this.$refs.srAnnouncement.textContent = "";
          // Use setTimeout to allow the DOM to update before setting the message again
          // This is necessary when the prev message is the same with the current one
          setTimeout(() => {
            this.$refs.srAnnouncement.textContent = message;
          }, 10); // A small delay to ensure the screen reader shows the change
        }
      },
      traverseTabList(e, tabId) {
        //Note:: Ensure tab elements have a ref="tab"
        const keyName = String(e.key).toLowerCase();
        const isRightArrow = keyName === "arrowright" || keyName === "right";
        const isLeftArrow = keyName === "arrowleft" || keyName === "left";
        const isEscKey = keyName === "escape" || keyName === "esc";
        const isTabKey = keyName === "tab";
        const isEnterKey = keyName === "enter";
        const shift = e.shiftKey;
        const ascending = isRightArrow || (isTabKey && shift);
        const descending = isLeftArrow || (isTabKey && !shift);

        if (isEnterKey) {
          this.$emit("enterPressed", {
            key: "enter",
            event: e,
            tabId: tabId
          });
          return;
        }

        if (isEscKey) {
          this.$emit("keyPress", {
            key: "escape",
            event: e,
            tabId: tabId
          });
          return;
        }

        if (isTabKey && shift) {
          this.$emit("keyPress", {
            key: "shiftTab",
            event: e,
            tabId: tabId
          });
          return;
        }

        const position = this.$refs.tab.indexOf(e?.target);
        if (isTabKey) {
          this.$emit("keyPress", {
            key: "tabKey",
            event: e,
            tabId: tabId
          });
          return;
        }

        if (position !== undefined) {
          this.$emit("announceToScreener", e, tabId);
          this.adjustTabFocusPosition(ascending, descending, position);
        }
      },
      adjustTabFocusPosition(ascending, descending, position) {
        let nextPosition = position;

        if (ascending) {
          nextPosition =
            nextPosition == this.$refs?.tab?.length - 1 ? 0 : nextPosition + 1;
        }

        if (descending) {
          nextPosition =
            nextPosition == 0 ? this.$refs?.tab?.length - 1 : nextPosition - 1;
        }
        this.$nextTick(() => {
          this.$refs.tab[nextPosition].focus();
        });
      }
    }
  };
};
