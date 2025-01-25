/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/prefer-string-starts-ends-with */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import {
  type ChangeEvent,
  type ClipboardEvent,
  createContext,
  type CSSProperties,
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePrevious } from "@mantine/hooks";
import GraphemeSplitter from "grapheme-splitter";

function syncTimeouts(cb: (...args: unknown[]) => unknown): number[] {
  const t1 = setTimeout(cb, 0);
  const t2 = setTimeout(cb, 1_0);
  const t3 = setTimeout(cb, 5_0);
  return [
    t1 as unknown as number,
    t2 as unknown as number,
    t3 as unknown as number,
  ];
}

export interface SlotProps {
  isActive: boolean;
  char: string | null;
  placeholderChar: string | null;
  hasFakeCaret: boolean;
}
export interface RenderProps {
  slots: SlotProps[];
  isFocused: boolean;
  isHovering: boolean;
}
type OverrideProps<T, R> = Omit<T, keyof R> & R;
type OTPInputBaseProps = OverrideProps<
  InputHTMLAttributes<HTMLInputElement>,
  {
    value?: string;
    onChange?: (newValue: string) => unknown;

    maxLength: number;

    textAlign?: "left" | "center" | "right";

    onComplete?: (...args: unknown[]) => unknown;
    pushPasswordManagerStrategy?: "increase-width" | "none";
    pasteTransformer?: (pasted: string) => string;

    containerClassName?: string;

    noScriptCSSFallback?: string | null;
  }
>;
type InputOTPRenderFn = (props: RenderProps) => ReactNode;
export type OTPInputProps = OTPInputBaseProps &
  (
    | {
        render: InputOTPRenderFn;
        children?: never;
      }
    | {
        render?: never;
        children: ReactNode;
      }
  );
export const OTPInputContext = createContext<RenderProps>({} as RenderProps);

const PWM_BADGE_MARGIN_RIGHT = 18;
const PWM_BADGE_SPACE_WIDTH_PX = 40;
const PWM_BADGE_SPACE_WIDTH = `${PWM_BADGE_SPACE_WIDTH_PX}px` as const;

const PASSWORD_MANAGERS_SELECTORS = [
  "[data-lastpass-icon-root]", // LastPass
  "com-1password-button", // 1Password
  "[data-dashlanecreated]", // Dashlane
  '[style$="2147483647 !important;"]', // Bitwarden
].join(",");

const getGraphemeSelection = (
  inputElement: HTMLInputElement | null,
): { start: number; end: number } => {
  if (!inputElement) {
    return { start: 0, end: 0 };
  }

  const selectionStartCodeUnits = inputElement.selectionStart || 0;
  const selectionEndCodeUnits = inputElement.selectionEnd || 0;
  const inputValue = inputElement.value;

  const splitter = new GraphemeSplitter();
  const graphemes = splitter.splitGraphemes(inputValue);

  let graphemeStartIndex = 0;
  let graphemeEndIndex = 0;
  let codeUnitsCount = 0;

  for (let i = 0; i < graphemes.length; i++) {
    const graphemeLength = graphemes[i]!.length;

    if (codeUnitsCount + graphemeLength <= selectionStartCodeUnits) {
      graphemeStartIndex = i + 1;
    }
    if (codeUnitsCount + graphemeLength <= selectionEndCodeUnits) {
      graphemeEndIndex = i + 1;
    }
    codeUnitsCount += graphemeLength;
  }

  return { start: graphemeStartIndex, end: graphemeEndIndex };
};

function usePasswordManagerBadge({
  containerRef,
  inputRef,
  pushPasswordManagerStrategy,
  isFocused,
}: {
  containerRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  pushPasswordManagerStrategy: OTPInputProps["pushPasswordManagerStrategy"];
  isFocused: boolean;
}) {
  /** Password managers have a badge
   *  and I'll use this state to push them
   *  outside the input */
  const [hasPWMBadge, setHasPWMBadge] = useState(false);
  const [hasPWMBadgeSpace, setHasPWMBadgeSpace] = useState(false);
  const [done, setDone] = useState(false);

  const willPushPWMBadge = useMemo(() => {
    if (pushPasswordManagerStrategy === "none") {
      return false;
    }

    const increaseWidthCase =
      (pushPasswordManagerStrategy === "increase-width" ||
        // TODO: remove 'experimental-no-flickering' support in 2.0.0
        pushPasswordManagerStrategy === "experimental-no-flickering") &&
      hasPWMBadge &&
      hasPWMBadgeSpace;

    return increaseWidthCase;
  }, [hasPWMBadge, hasPWMBadgeSpace, pushPasswordManagerStrategy]);

  const trackPWMBadge = useCallback(() => {
    const container = containerRef.current;
    const input = inputRef.current;
    if (
      !container ||
      !input ||
      done ||
      pushPasswordManagerStrategy === "none"
    ) {
      return;
    }

    const elementToCompare = container;

    // Get the top right-center point of the container.
    // That is usually where most password managers place their badge.
    const rightCornerX =
      elementToCompare.getBoundingClientRect().left +
      elementToCompare.offsetWidth;
    const centereredY =
      elementToCompare.getBoundingClientRect().top +
      elementToCompare.offsetHeight / 2;
    const x = rightCornerX - PWM_BADGE_MARGIN_RIGHT;
    const y = centereredY;

    // Do an extra search to check for famous password managers
    const pmws = document.querySelectorAll(PASSWORD_MANAGERS_SELECTORS);

    // If no password manager is automatically detect,
    // we'll try to dispatch document.elementFromPoint
    // to identify badges
    if (pmws.length === 0) {
      const maybeBadgeEl = document.elementFromPoint(x, y);

      // If the found element is the input itself,
      // then we assume it's not a password manager badge.
      // We are not sure. Most times that means there isn't a badge.
      if (maybeBadgeEl === container) {
        return;
      }
    }

    setHasPWMBadge(true);
    setDone(true);
  }, [containerRef, inputRef, done, pushPasswordManagerStrategy]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || pushPasswordManagerStrategy === "none") {
      return;
    }

    // Check if the PWM area is 100% visible
    function checkHasSpace() {
      const viewportWidth = window.innerWidth;
      const distanceToRightEdge =
        viewportWidth - (container?.getBoundingClientRect()?.right ?? 0);
      setHasPWMBadgeSpace(distanceToRightEdge >= PWM_BADGE_SPACE_WIDTH_PX);
    }

    checkHasSpace();
    const interval = setInterval(checkHasSpace, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [containerRef, pushPasswordManagerStrategy]);

  useEffect(() => {
    const _isFocused = isFocused || document.activeElement === inputRef.current;

    if (pushPasswordManagerStrategy === "none" || !_isFocused) {
      return;
    }
    const t1 = setTimeout(trackPWMBadge, 0);
    const t2 = setTimeout(trackPWMBadge, 2000);
    const t3 = setTimeout(trackPWMBadge, 5000);
    const t4 = setTimeout(() => {
      setDone(true);
    }, 6000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [inputRef, isFocused, pushPasswordManagerStrategy, trackPWMBadge]);

  return { hasPWMBadge, willPushPWMBadge, PWM_BADGE_SPACE_WIDTH };
}

export const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  (
    {
      value: uncheckedValue,
      onChange: uncheckedOnChange,
      maxLength,
      textAlign = "left",
      pattern,
      placeholder,
      inputMode = "numeric",
      onComplete,
      pushPasswordManagerStrategy = "increase-width",
      pasteTransformer,
      containerClassName,
      noScriptCSSFallback = NOSCRIPT_CSS_FALLBACK,

      render,
      children,

      ...props
    },
    ref,
  ) => {
    const splitter = new GraphemeSplitter();
    // Only used when `value` state is not provided
    const [internalValue, setInternalValue] = useState(
      typeof props.defaultValue === "string" ? props.defaultValue : "",
    );

    // Definitions
    const value = uncheckedValue ?? internalValue;
    const previousValue = usePrevious(value);
    const onChange = useCallback(
      (newValue: string) => {
        uncheckedOnChange?.(newValue);
        setInternalValue(newValue);
      },
      [uncheckedOnChange],
    );
    const regexp = useMemo(
      () =>
        pattern
          ? typeof pattern === "string"
            ? new RegExp(pattern)
            : pattern
          : null,
      [pattern],
    );

    /** useRef */
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const initialLoadRef = useRef({
      value,
      onChange,
      isIOS:
        typeof window !== "undefined" &&
        window?.CSS?.supports?.("-webkit-touch-callout", "none"),
    });
    const inputMetadataRef = useRef<{
      prev: [number | null, number | null, "none" | "forward" | "backward"];
    }>({
      prev: [
        inputRef.current?.selectionStart || null,
        inputRef.current?.selectionEnd || null,
        inputRef.current?.selectionDirection || "none",
      ],
    });
    useImperativeHandle(ref, () => inputRef.current!, []);
    useEffect(() => {
      const input = inputRef.current;
      const container = containerRef.current;

      if (!input || !container) {
        return;
      }

      // Sync input value
      if (initialLoadRef.current.value !== input.value) {
        initialLoadRef.current.onChange(input.value);
      }

      // Previous selection
      inputMetadataRef.current.prev = [
        input.selectionStart,
        input.selectionEnd,
        input.selectionDirection!,
      ];
      function onDocumentSelectionChange() {
        if (document.activeElement !== input) {
          setMirrorSelectionStart(null);
          setMirrorSelectionEnd(null);
          return;
        }

        const { start: _s, end: _e } = getGraphemeSelection(input);
        const _dir = input!.selectionDirection;
        const _ml = input!.maxLength;
        const _val = splitter.splitGraphemes(input!.value);
        const _prev = inputMetadataRef.current.prev;

        // Algorithm
        let start = -1;
        let end = -1;
        let direction: "forward" | "backward" | "none" | undefined = undefined;
        if (_val.length !== 0 && _s !== null && _e !== null) {
          const isSingleCaret = _s === _e;
          const isInsertMode = _s === _val.length && _val.length < _ml;

          if (isSingleCaret && !isInsertMode) {
            const c = _s;
            if (c === 0) {
              start = 0;
              end = 1;
              direction = "forward";
            } else if (c === _ml) {
              start = c - 1;
              end = c;
              direction = "backward";
            } else if (_ml > 1 && _val.length > 1) {
              let offset = 0;
              if (_prev[0] !== null && _prev[1] !== null) {
                direction = c < _prev[1] ? "backward" : "forward";
                const wasPreviouslyInserting =
                  _prev[0] === _prev[1] && _prev[0] < _ml;
                if (direction === "backward" && !wasPreviouslyInserting) {
                  offset = -1;
                }
              }

              start = offset + c;
              end = offset + c + 1;
            }
          }

          if (start !== -1 && end !== -1 && start !== end) {
            inputRef.current?.setSelectionRange(start, end, direction);
          }
        }

        // Finally, update the state
        const s = start !== -1 ? start : _s;
        const e = end !== -1 ? end : _e;
        const dir = direction ?? _dir;
        setMirrorSelectionStart(s);
        setMirrorSelectionEnd(e);
        // Store the previous selection value
        inputMetadataRef.current.prev = [s, e, dir!];
      }
      document.addEventListener("selectionchange", onDocumentSelectionChange, {
        capture: true,
      });

      // Set initial mirror state
      onDocumentSelectionChange();
      document.activeElement === input && setIsFocused(true);

      // Apply needed styles
      if (!document.getElementById("input-otp-style")) {
        const styleEl = document.createElement("style");
        styleEl.id = "input-otp-style";
        document.head.appendChild(styleEl);

        if (styleEl.sheet) {
          const autofillStyles =
            "background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;";

          safeInsertRule(
            styleEl.sheet,
            "[data-input-otp]::selection { background: transparent !important; color: transparent !important; }",
          );
          safeInsertRule(
            styleEl.sheet,
            `[data-input-otp]:autofill { ${autofillStyles} }`,
          );
          safeInsertRule(
            styleEl.sheet,
            `[data-input-otp]:-webkit-autofill { ${autofillStyles} }`,
          );
          // iOS
          safeInsertRule(
            styleEl.sheet,
            `@supports (-webkit-touch-callout: none) { [data-input-otp] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } }`,
          );
          // PWM badges
          safeInsertRule(
            styleEl.sheet,
            `[data-input-otp] + * { pointer-events: all !important; }`,
          );
        }
      }
      // Track root height
      const updateRootHeight = () => {
        if (container) {
          container.style.setProperty(
            "--root-height",
            `${input.clientHeight}px`,
          );
        }
      };
      updateRootHeight();
      const resizeObserver = new ResizeObserver(updateRootHeight);
      resizeObserver.observe(input);

      return () => {
        document.removeEventListener(
          "selectionchange",
          onDocumentSelectionChange,
          { capture: true },
        );
        resizeObserver.disconnect();
      };
    }, []);

    /** Mirrors for UI rendering purpose only */
    const [isHoveringInput, setIsHoveringInput] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [mirrorSelectionStart, setMirrorSelectionStart] = useState<
      number | null
    >(null);
    const [mirrorSelectionEnd, setMirrorSelectionEnd] = useState<number | null>(
      null,
    );

    /** Effects */
    useEffect(() => {
      syncTimeouts(() => {
        // Forcefully remove :autofill state
        inputRef.current?.dispatchEvent(new Event("input"));

        const { start: s, end: e } = getGraphemeSelection(inputRef.current);
        const dir = inputRef.current?.selectionDirection;
        if (s !== null && e !== null) {
          setMirrorSelectionStart(s);
          setMirrorSelectionEnd(e);
          inputMetadataRef.current.prev = [s, e, dir!];
        }
      });
    }, [value, isFocused]);

    useEffect(() => {
      if (previousValue === undefined) {
        return;
      }

      if (
        value !== previousValue &&
        splitter.splitGraphemes(previousValue).length < maxLength &&
        splitter.splitGraphemes(value).length === maxLength
      ) {
        onComplete?.(value);
      }
    }, [maxLength, onComplete, previousValue, value]);

    const pwmb = usePasswordManagerBadge({
      containerRef,
      inputRef,
      pushPasswordManagerStrategy,
      isFocused,
    });

    /** Event handlers */
    const _changeListener = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = splitter
          .splitGraphemes(e.currentTarget.value)
          .slice(0, maxLength)
          .join("");
        if (
          splitter.splitGraphemes(newValue).length > 0 &&
          regexp &&
          !regexp.test(newValue)
        ) {
          e.preventDefault();
          return;
        }
        const maybeHasDeleted =
          typeof previousValue === "string" &&
          splitter.splitGraphemes(newValue).length <
            splitter.splitGraphemes(previousValue).length;
        if (maybeHasDeleted) {
          // Since cutting/deleting text doesn't trigger
          // selectionchange event, we'll have to dispatch it manually.
          // NOTE: The following line also triggers when cmd+A then pasting
          // a value with smaller length, which is not ideal for performance.
          document.dispatchEvent(new Event("selectionchange"));
        }
        onChange(newValue);
      },
      [maxLength, onChange, previousValue, regexp],
    );
    const _focusListener = useCallback(() => {
      if (inputRef.current) {
        const start = Math.min(
          splitter.splitGraphemes(inputRef.current.value).length,
          maxLength - 1,
        );

        const end = splitter.splitGraphemes(inputRef.current.value).length;
        inputRef.current?.setSelectionRange(start, end);
        setMirrorSelectionStart(start);
        setMirrorSelectionEnd(end);
      }
      setIsFocused(true);
    }, [maxLength]);
    // Fix iOS pasting
    const _pasteListener = useCallback(
      (e: ClipboardEvent<HTMLInputElement>) => {
        const input = inputRef.current;
        if (
          !pasteTransformer &&
          (!initialLoadRef.current.isIOS || !e.clipboardData || !input)
        ) {
          return;
        }

        const _content = e.clipboardData.getData("text/plain");
        const content = pasteTransformer
          ? pasteTransformer(_content)
          : _content;
        e.preventDefault();

        const { start, end } = getGraphemeSelection(input);

        const isReplacing = start !== end;

        const newValueUncapped = isReplacing
          ? splitter.splitGraphemes(value).slice(0, start).join("") +
            content +
            splitter.splitGraphemes(value).slice(end).join("") // Replacing
          : splitter.splitGraphemes(value).slice(0, start).join("") +
            content +
            splitter.splitGraphemes(value).slice(start).join(""); // Inserting
        const newValue = splitter
          .splitGraphemes(newValueUncapped)
          .slice(0, maxLength)
          .join("");

        if (
          splitter.splitGraphemes(newValue).length > 0 &&
          regexp &&
          !regexp.test(newValue)
        ) {
          return;
        }

        input!.value = splitter.splitGraphemes(newValue).join("");
        onChange(newValue);

        const _start = Math.min(
          splitter.splitGraphemes(newValue).length,
          maxLength - 1,
        );
        const _end = splitter.splitGraphemes(newValue).length;

        input!.setSelectionRange(_start, _end);
        setMirrorSelectionStart(_start);
        setMirrorSelectionEnd(_end);
      },
      [maxLength, onChange, regexp, value],
    );

    /** Styles */
    const rootStyle = useMemo<CSSProperties>(
      () => ({
        position: "relative",
        cursor: props.disabled ? "default" : "text",
        userSelect: "none",
        WebkitUserSelect: "none",
        pointerEvents: "none",
      }),
      [props.disabled],
    );

    const inputStyle = useMemo<CSSProperties>(
      () => ({
        position: "absolute",
        inset: 0,
        width: pwmb.willPushPWMBadge
          ? `calc(100% + ${pwmb.PWM_BADGE_SPACE_WIDTH})`
          : "100%",
        clipPath: pwmb.willPushPWMBadge
          ? `inset(0 ${pwmb.PWM_BADGE_SPACE_WIDTH} 0 0)`
          : undefined,
        height: "100%",
        display: "flex",
        textAlign,
        opacity: "1", // Mandatory for iOS hold-paste
        color: "transparent",
        pointerEvents: "all",
        background: "transparent",
        caretColor: "transparent",
        border: "0 solid transparent",
        outline: "0 solid transparent",
        boxShadow: "none",
        lineHeight: "1",
        letterSpacing: "-.5em",
        fontSize: "var(--root-height)",
        fontFamily: "monospace",
        fontVariantNumeric: "tabular-nums",
        // letterSpacing: '-1em',
        // transform: 'scale(1.5)',
        // paddingRight: '100%',
        // paddingBottom: '100%',
        // debugging purposes
        // inset: undefined,
        // position: undefined,
        // color: 'black',
        // background: 'white',
        // opacity: '1',
        // caretColor: 'black',
        // padding: '0',
        // letterSpacing: 'unset',
        // fontSize: 'unset',
        // paddingInline: '.5rem',
      }),
      [pwmb.PWM_BADGE_SPACE_WIDTH, pwmb.willPushPWMBadge, textAlign],
    );

    /** Rendering */
    const renderedInput = useMemo(
      () => (
        <input
          autoComplete={props.autoComplete || "one-time-code"}
          {...props}
          data-input-otp
          data-input-otp-placeholder-shown={
            splitter.splitGraphemes(value).length === 0 || undefined
          }
          data-input-otp-mss={mirrorSelectionStart}
          data-input-otp-mse={mirrorSelectionEnd}
          inputMode={inputMode}
          pattern={regexp?.source}
          aria-placeholder={placeholder}
          style={inputStyle}
          //   maxLength={maxLength}
          value={value}
          ref={inputRef}
          onPaste={(e) => {
            _pasteListener(e);
            props.onPaste?.(e);
          }}
          onChange={_changeListener}
          onMouseOver={(e) => {
            setIsHoveringInput(true);
            props.onMouseOver?.(e);
          }}
          onMouseLeave={(e) => {
            setIsHoveringInput(false);
            props.onMouseLeave?.(e);
          }}
          onFocus={(e) => {
            _focusListener();
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
      ),
      [
        _changeListener,
        _focusListener,
        _pasteListener,
        inputMode,
        inputStyle,
        maxLength,
        mirrorSelectionEnd,
        mirrorSelectionStart,
        props,
        regexp?.source,
        value,
      ],
    );

    const contextValue = useMemo<RenderProps>(() => {
      return {
        slots: Array.from({ length: maxLength }).map((_, slotIdx) => {
          const isActive =
            isFocused &&
            mirrorSelectionStart !== null &&
            mirrorSelectionEnd !== null &&
            ((mirrorSelectionStart === mirrorSelectionEnd &&
              slotIdx === mirrorSelectionStart) ||
              (slotIdx >= mirrorSelectionStart &&
                slotIdx < mirrorSelectionEnd));

          const char =
            splitter.splitGraphemes(value)[slotIdx] !== undefined
              ? splitter.splitGraphemes(value)[slotIdx]!
              : null;
          const placeholderChar =
            splitter.splitGraphemes(value)[0] !== undefined
              ? null
              : (placeholder?.[slotIdx] ?? null);

          return {
            char,
            placeholderChar,
            isActive,
            hasFakeCaret: isActive && char === null,
          };
        }),
        isFocused,
        isHovering: !props.disabled && isHoveringInput,
      };
    }, [
      isFocused,
      isHoveringInput,
      maxLength,
      mirrorSelectionEnd,
      mirrorSelectionStart,
      props.disabled,
      value,
    ]);

    const renderedChildren = useMemo(() => {
      if (render) {
        return render(contextValue);
      }
      return (
        <OTPInputContext.Provider value={contextValue}>
          {children}
        </OTPInputContext.Provider>
      );
    }, [children, contextValue, render]);

    return (
      <>
        {noScriptCSSFallback !== null && (
          <noscript>
            <style>{noScriptCSSFallback}</style>
          </noscript>
        )}

        <div
          ref={containerRef}
          data-input-otp-container
          style={rootStyle}
          className={containerClassName}
        >
          {renderedChildren}

          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          >
            {renderedInput}
          </div>
        </div>
      </>
    );
  },
);
OTPInput.displayName = "Input";

function safeInsertRule(sheet: CSSStyleSheet, rule: string) {
  try {
    sheet.insertRule(rule);
  } catch {
    console.error("input-otp could not insert CSS rule:", rule);
  }
}

// Decided to go with <noscript>
// instead of `scripting` CSS media query
// because it's a fallback for initial page load
// and the <script> tag won't be loaded
// unless the user has JS disabled.
const NOSCRIPT_CSS_FALLBACK = `
[data-input-otp] {
  --nojs-bg: white !important;
  --nojs-fg: black !important;

  background-color: var(--nojs-bg) !important;
  color: var(--nojs-fg) !important;
  caret-color: var(--nojs-fg) !important;
  letter-spacing: .25em !important;
  text-align: center !important;
  border: 1px solid var(--nojs-fg) !important;
  border-radius: 4px !important;
  width: 100% !important;
}
@media (prefers-color-scheme: dark) {
  [data-input-otp] {
    --nojs-bg: black !important;
    --nojs-fg: white !important;
  }
}`;
