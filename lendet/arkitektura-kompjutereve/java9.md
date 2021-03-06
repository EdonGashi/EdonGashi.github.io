# Kërcimet, procedurat, stack

---

**Kërcimet**

Rrjedha e programit mund të ndryshohet përmes **kërcimeve**.

1. **Kërcimet pa kusht** gjithmojnë kalojnë në ndonjë pjesë tjetër të programit.
2. **Kërcimet me kusht** vlerësojnë ndonjë flag dhe nëse ka vlerë të caktuar bëhet kërcimi.

---

**Kërcimet pa kusht**

Përmes instruksionit `JMP` kalon rrjedha e programit në ndonjë pjesë tjetër.

Sintaksa:

```x86asm
; Kërcen te labela
JMP label
; ...
label:
; Urdherat...
```

---

**Kërcimet me kusht**

Kërcimet me kusht vlerësojnë ndonjë flag të ALU dhe në bazë të vlerës bëjnë kërcim.

Tri lloje kërcimesh me kusht:

1. Kërcimet që testojnë flag të caktuar.
2. Kërcimet që krahasojnë numrat me shenjë.
3. Kërcimet që krahasojnë numrat pa shenjë.

---

**Kërcimet që testojnë flag të caktuar**

**Shembull:** Jump if Sign ($\texttt{SF}=1$).

```x86asm
JS labela
; ...
labela:
```

---

**Kërcimet që krahasojnë numrat me shenjë**

Instruksionet e këtij grupi marrin parasysh numrat në formë 2-komplementi.

Shembuj:

- JG - Jump if Greater (`ZF=0` dhe `SF=OF`)
- JL - Jump if Less (`SF!=OF`)
- JGE - Jump if Greater or Equal (`SF=OF`)

---

**Shembull:** Jump if Less ($\texttt{SF}\neq\texttt{OF}$).

$$
A - B < 0 \Rightarrow A < B \land \texttt{SF}=1
$$

```x86
MOV AX, -5
MOV BX, -3
CMP AX, BX
JL me_vogel
MOV CX, 10
JMP fund
me_vogel:
MOV CX, 20
fund:
RET
```

---

**Kërcimet që krahasojnë numrat pa shenjë**

Shembuj:

- JA - Jump if Above (`CF=0` dhe `ZF=0`)
- JB - Jump if Below (`CF=1`)
- JAE - Jump if Above or Equal (`CF=0`)

---

**Shembull:** Jump if Below ($\texttt{CF}=1$).

```x86
MOV AX, 5
MOV BX, 9
CMP AX, BX
JB me_vogel
MOV CX, 10
JMP fund
me_vogel:
MOV CX, 20
fund:
RET
```

---

Arsyetimi pse `JB` kërkon që `CF=1`:

```text
A=3, B=5

(1)0011 (3)
 - 0101 (5)
-------
   1110
```

```text
A=5, B=3

(0)0101 (5)
 - 0011 (3)
-------
   0010
```

---

**Procedurat**

Procedura është bllok kodi i ripërdorshëm. Ajo identifikohet me një adresë në memorie të kodit.

Kur thirret procedura në stack ruhet pozita aktuale e programit, dhe pas përfundimit të procedurës urdhëri `RET` e kthen programin në pozitën paraprake.

---

Deklarimi i procedurës:

```x86asm
procedura PROC
; KODI
RET
procedura ENDP
```

Thirrja e procedurës:

```x86asm
CALL procedura
```

---

**Makrot**

Makro duket si procedurë por në realitet është zëvendësim.

Macros mund t'i deklarojmë parametra të cilat zëvendësohen në trupin e saj.

---

Deklarimi:

```x86asm
shuma MACRO p1, p2
MOV AX, p1
ADD AX, p2
ENDM
```

Thirrja:

```x86asm
SHUMA 2, 3
; AX = 5
```

---

**Dallimi mes makros dhe procedurës**

- Macro zëvendësohet aty për aty ndërsa procedura gjendet në programin e kompajlluar.
- Procedura thirret përmes `CALL` ndërsa për makro vetëm shkruhet emri.
- Procedura përfundon me `RET` ndërsa makro jo.
- Makro pranon parametra pasi që vetëm zëvendësohen në trup. Procedurës parametrat i dërgohen në regjistra ose në stack.

---

**Pyetje:** Kemi një bllok kodi me 100 instruksione dhe e duhet ta ekzekutojmë 2 herë.

1. Sa instruksione ka programi nëse blloku implementohet përmes procedurës?
2. Sa instruksione ka programi nëse blloku implementohet përmes macros?

---

**Stacku**

Stacku paraqet një hapësirë memorike ku shënimet ruhen me renditje LIFO (Last-In, First-Out).

![](/lendet/arkitektura-kompjutereve/stack.png) <!-- .element: style="max-height:200px;border:none;" -->

---

Në stack shënimet futen me instruksionin `PUSH`.

Gjatë shtimit inkrementohet stack pointeri për madhësinë e caktuar.

Procesi i kundërt është `POP`, i cili ruan vlerën nga maja e stekut.

---

Shpesh nevojitet stacku për të ruajtur gjendjen e regjistrave gjatë ndonjë procedurë, ashtu që pas ekzekutimit ta rikthejmë gjendjen e mëparshme.

```x86asm
shtyp PROC
PUSH AX
MOV AX, 3
CALL PRINT_NUM
POP AX
RET
ENDP
```

---

**Detyrë:** Të lexohen dy numra nga tastiera. Të tregohet cili është më i madh ose a janë të barabartë.

--

```x86asm
INCLUDE 'emu8086.inc'

NEWLINE MACRO
PRINTN ' '
ENDM

READNUM MACRO DST
PUSH CX
CALL SCAN_NUM
MOV DST, CX
POP CX
ENDM

ORG 100h

PRINT 'Shtypni nr A: '
READNUM NUM_A
NEWLINE

PRINT 'Shtypni nr B: '
READNUM NUM_B
NEWLINE

MOV AX, NUM_A
MOV BX, NUM_B
CMP AX, BX

JL me_vogel  ; if a < b
JE baraz     ; else if a = b
JMP me_madhe ; else

me_vogel:
PRINT 'A < B'
JMP fundi

baraz:
PRINT 'A = B'
JMP fundi

me_madhe:
PRINT 'A > B'

fundi:
RET

NUM_A DW ?
NUM_B DW ?

DEFINE_SCAN_NUM
```

---

**Detyrë:** Të lexohet nga tastiera një numër i plotë $x$. Të llogaritet dhe të shfaqet vlera $y$ sipas funksionit:

$$
y = \begin{cases}
-4x + 3 & \text{kur}\; x \leq 3 \\
x - 5 & \text{kur}\; x > 3
\end{cases}
$$

--

```x86asm
INCLUDE 'emu8086.inc'

NEWLINE MACRO
PRINTN ' '
ENDM

READNUM MACRO DST
PUSH CX
CALL SCAN_NUM
MOV DST, CX
POP CX
ENDM

ORG 100h

PRINT 'Shtyp numrin x: '
READNUM NUM_X
NEWLINE
MOV AX, NUM_X
CMP AX, 3
JG me_madhe
me_vogel:
MOV BX, -4
IMUL BX
ADD AX, 3
MOV NUM_Y, AX
JMP fundi

me_madhe:
SUB AX, 5
MOV NUM_Y, AX

fundi:
PRINT 'Numri y: '
MOV AX, NUM_Y
CALL PRINT_NUM
RET

NUM_X DW ?
NUM_Y DW ?

DEFINE_SCAN_NUM
DEFINE_PRINT_NUM
DEFINE_PRINT_NUM_UNS
```

---

**Detyrë:** Të shkruhet programi i cili shfaq numrat tek nga $1$ deri $n$.

--

```x86asm
INCLUDE 'emu8086.inc'

NEWLINE MACRO
PRINTN ' '
ENDM

READNUM MACRO DST
PUSH CX
CALL SCAN_NUM
MOV DST, CX
POP CX
ENDM

ORG 100h

PRINT 'Shtyp numrin n: '
READNUM N
NEWLINE

MOV CX, 1
loop:
TEST CX, 1
JZ next

tek:
MOV AX, CX
CALL PRINT_NUM
PRINT ' '

next:
INC CX
CMP CX, N
JLE loop

; for (c = 1; c <= n; c++) {
;   if (c & 1 != 0) {
;     print (c)
;   }
; }

RET

N DW ?
DEFINE_SCAN_NUM
DEFINE_PRINT_NUM
DEFINE_PRINT_NUM_UNS
```

---

**Detyrë:** Të llogaritet shuma:

$$
S = \sum_{\begin{array}{c}i=1\\i\neq 5\end{array}}^{n}{(2i+3)}
$$

---

**Detyrë:** Të inicializohet vargu $\lbrace 7,2,5,6,1,10,3 \rbrace$

1. Të shfaqen të gjithë elementet e këtij vargu.
2. Të gjendet shuma e elementeve të vargut.
3. Të tregohet sa elemente janë $\geq 5$.
4. Të gjendet minimumi dhe maksimumi.
5. Të gjendet shuma e numrave tek dhe çift.
6. Të gjendet shuma e elementit të parë dhe të fundit.

--

```x86asm
INCLUDE 'emu8086.inc'

ORG 100h

PRINT 'Numrat:'
MOV BX, 0
loop1:
MOV AH, 0
MOV AL, VARGU[BX] ; [VARGU + BX]
PRINT ' '
CALL PRINT_NUM
INC BX
CMP BX, N
JL loop1

PRINTN ' '
MOV BX, 0
loop2:
MOV AL, VARGU[BX]
ADD SHUMA, AL
INC BX
CMP BX, N
JL loop2

PRINT 'Shuma: '
MOV AH, 0
MOV AL, SHUMA
CALL PRINT_NUM

PRINTN ' '
MOV BX, 0
loop3:
MOV AL, VARGU[BX]
CMP AL, 5
JB me_vogel_5
; >= 5
INC NR_ELEMENTEVE
me_vogel_5:
INC BX
CMP BX, N
JL loop3

PRINT 'Nr elementeve >= 5: '
MOV AH, 0
MOV AL, NR_ELEMENTEVE
CALL PRINT_NUM

MOV AL, VARGU[0]
MOV MAKSIMUMI, AL
MOV MINIMUMI, AL
MOV BX, 1
loop4:
MOV AL, VARGU[BX]
CMP AL, MAKSIMUMI
JBE me_vogel_se_max
MOV MAKSIMUMI, AL
me_vogel_se_max:

CMP AL, MINIMUMI
JAE me_madhe_se_min
MOV MINIMUMI, AL
me_madhe_se_min:

INC BX
CMP BX, N
JL loop4

PRINTN ' '
PRINT 'Minimumi: '
MOV AH, 0
MOV AL, Minimumi
CALL PRINT_NUM

PRINTN ' '
PRINT 'Maksimumi: '
MOV AH, 0
MOV AL, Maksimumi
CALL PRINT_NUM
PRINTN ' '

RET

SHUMA DB 0
NR_ELEMENTEVE DB 0
MINIMUMI DB ?
MAKSIMUMI DB ?
VARGU DB 7, 2, 5, 6, 1, 10, 3
N EQU 7
DEFINE_PRINT_NUM
DEFINE_PRINT_NUM_UNS
```

---

**Detyrë:** Të lexohen dy numra dhe një karakter. Varësisht nga karakteri, të llogaritet:

Karakteri|Shprehja
---|---
`+`|`a + b`
`-`|`a - b`
`*`|`a * b`
`/`|`a / b`
`%`|`a % b`
