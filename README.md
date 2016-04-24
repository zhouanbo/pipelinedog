<img src="http://pipeline.dog/icon.png" alt="pipelinedog logo" height="128" >
# PiplineDog Docs


## Overview

This is the documentation of PipelineDog, a tool that helps you better construct and maintain your scientific pipelines.

## Concepts

***Inputlist***

A list of inputs with each input per line. This is the input of the entire pipeline, as well as the input of each pipeline step, and it's also what the LEASH expression is executed upon. Initially there's a default INPUT.list.txt as a input of the entire pipeline. *Inputlists* are the basic units of pipeline step communication, and the major behaviors of PipelineDog are about parsing, processing and generating *Inputlists*.

***Dynamic inputs and static inputs***

Inputs are categorized into dynamic inputs and static inputs. Dynamic inputs are different in each run of the pipeline (eg: bam files). Static inputs remain the same each run (eg: reference files or "--cpu-cores 8"). Static inputs can be specified directly as how one would normally run a program. However, dynamic inputs need processing before it can be used as the input for a pipeline step since extra flexibility is required.

***Hierarchy***

The input and output of a pipeline step are both *Inputlists*, so that upstream and downstream pipeline steps can be connected. Downstream pipeline steps are at lower hierarchy than the upstream steps. Lower hierarchy steps can only see the output of higher hierarchy steps to avoid truncated inputs, and steps at the highest hierarchy can only use the initial *INPUT.list.txt* specified by PipelineDog.

***LEASH***

A expression system that describe the conversion from a *Inputlist* to a pipeline step's dynamic input. It is an acronym for "Little Embarrassed About Such Humor". Not really.

***Elements***

The components that used to assemble a *LEASH* expression, including:
  - Indicator: indicates the start and end of an expression using double percentage sign (eg: '{}').
  - Range: a regular expression, or a range of numbers resembling that used in the linux cut command (eg: '1-5' or '2-' or '1,3,7'). The character '-' means to select all.
  - String: a singe quoted string (eg: '.bam' or '.vcf' or '-b')
  - Symbols: Other characters specifying the structure of the expression (eg: '|' or 'L' or 'E').

***Segments***

An *LEASH* expression typically consists of 5 segments, which are: (all of these are optional, however, correct ordering is required):

1. **File Selection**: 
the first segment of the expression, specifying which Inputlist the expression should execute upon. This step is a *range* pipes the *Inputlists* to the next segment. If this segment is omitted, the default value '-' is used.

2. **Line Selection**: 
a *Range* selecting what lines of inputs to be used in the Inputlist specified in *File Selection*. This step pipes an array of inputs to the next segment. If this segment is omitted, the default value '-' is used.

3. **Base Selection**: 
a *Range* trimming inputs from the result of *Line Selection*. This step pipes an array of trimmed inputs to the next segment. If this segment is omitted, a default value 'P-' is used.
  - Starting with or without a character 'P' to indicate to include the entire file path or just the file names in the input.
  - Following that, a *Range* ending with the character 'B' is used to specify which (from right to left) base (parts of the file name separated by dots) of the file name to keep. For example, given the file name 'NA12877.sort.rmdup.chr20.bam', a *Reconstruction* segment of '2-4B' would return 'sort.rmdup.chr20'.

4. **Extension**
a segment that extends file paths from the *subtraction*. This step pipes an array of extended inputs to the next segment.
First, a 3 charactor notation "PRE" or "SUF" is given to indicate whether to extend the input toward left or right. Then, a *String* was then given to specify the extension to be added to the selected base names. You can add extensions before and after the base at the same time by using both "PRE" and "SUF" notations in the segments. If this segment is omitted, a empty string is used.

5. **Arrangement**: 
leaded by a *String* that indicates how to arrange the inputs from previous segments.
  - if 'c' (comma) or 's' (spcae) is given, then all the inputs are separated by comma or space in between. 
  - if an option name (a string beginning with a dash) is given, then the return will begin with this option plus a space before each input. 
  - if 'l' is given, then the pipeline step is looped through each of the input. The number of loop is determined by the line numbers of the first keyword option.
  - if 'n' is given, no arrangement will be made, a string with paths directly next to each other will be returned.
  - if 'a' is given, an array of inputs prior to this segment will be returned. This array can be used as the value of the "output_file" property.
  - if the *Arrangement* segment is omitted, the defualt value 'n' will be used. 

***Short & Long Format***

There are two different formats to write an LEASH expression. In *long format*, a LEASH expression is specified as an object and segments are properties of the object. In *short format*, a LEASH expression is specified as a string wrapped by curly brackets and the segments are separated by '|'.
The segment identifiers in *long format* are properties of an object:

|Segment Name|Object Property|
|---|---|
|File Selection|"file"|
|Line Selection|"line"|
|Base Selection|"base"|
|Extension|"extension"|
|Arrangement|"arrangement"|

The segment identifiers in *short format* are single uppercase characters at the end of each segment:

|Segment Name|Single Character|
|---|---|
|File Selection|F|
|Line Selection|L|
|Base Selection|B|
|Extension|E|
|Arrangement|A|


***Step Definition***

A pipeline step is defined by a JSON object. Taking advantage of the JSON format, each step can be exported when the definition is finished and can be used again in the future. Also, different combinations of steps can be assembled to defined new pipelines.

**Long format:**
```json
{
	"name": "bam2sam",
	"description": "convert bam files to sam files",
	"invoke": "samtools view",
	"inputlists": [
    "INPUT.list.txt"
    ],
	"options": [
    "-h", 
    "{INPUT}", 
    "{OUTPUT}"
    ],
	"input_option": {
    "base": "-",
    "arrangement": "'l'",
    },
	"output_option": {
    "base": "1",
    "extension": "SUF'.sam'",
    "arrangement": "'l'"
    },
	"output_files": {
    "base": "1",
    "extension": "SUF'.sam'",
    "arrangement": "'a'"
    }
}
```

**Short format:**
```json
{
	"name": "bam2sam",
	"description": "convert bam files to sam files",
	"invoke": "samtools view",
	"inputlists": [
    "INPUT.list.txt"
    ],
	"options": [
    "-h", 
    "{INPUT}", 
    "{OUTPUT}"
    ],
	"input_option": "{-B|'l'A}",
	"output_option": "{1B|SUF'.sam'E|'l'A}",
	"output_files": "{1B|SUF'.sam'E|'a'A}"
}
```

The properties of the object are defined as following:

**name**: A string containing the name of the pipeline step.

**description**: A string that contains a functional description of what the step does.

**invoke**: The command to invoke the pipeline step.

**inputlists**: An array containing *Inputlists*, which is later selected by *LEASH* expressions.

**options**: An array of strings that correspond to each of the static input that is normally used in the pipeline step. The places you wish to be replaced by a LEASH expression should each be marked by uppercase keywords wrapped by curly brackets. For example: {INPUT}, {OUTPUT}, {LABEL} or {LOG}.

**[keyword]_option**: A series of options that defined by LEASH expressions. The naming of these options should follow the convention of a lowercase keyword_option, so that the outcome of the expression will replace the uppercase {KEYWORD} marks in the previous *options*. If multiple LEASH expression need to be used in a single option, using the short format is necessary. Some suggested keyword options are listed below:

- *input_option*: specify the dynamic input of the pipeline step. 

- *output_option*: specify the output of the pipeline step.

- *label_option*: specify labels of experimental conditions that some tools may require.

- *log_option*: specify the path of logs.

**output_files**: An array containing the actual file output of the pipeline step. LEASH expression can be used as a string in the array with the LEASH 'a'A *Arrangement*, it will later be converted into multiple parsed files. If both dynamic outputs and static outputs need to be specified, a short format is necessary since long format (specifying the output files as an LEASH object) will block you from specifying other static file paths.

>Notice the difference between *output_files* and suggested *output_option*: *output_option* is required by the pipeline step and supplied to it directly; *output_option*, however, is required by PipelineDog and used to generate the *Inputlist* for the next pipeline step.

***Direct Pipe***

To implement direct pipes between tools, there are two ways:
- Defining the pipe in *invoke* by using process substitution "`< <()`" syntax from BASH
- Defining the pipe as an option by using pipe "`|`" syntax from BASH

Details of implementation are shown in the examples.


## Use Cases

***Case 1: bam to sam***

**Inputlist**

INPUT.list.txt:

```
/home/bam2sam/test1.bam
/home/bam2sam/test2.bam
/home/bam2sam/test3.bam
```

**Tool definition**

```json
{
	"name": "bam2sam",
	"description": "convert bam files to sam files",
	"invoke": "samtools view",
	"inputlists": [
    "INPUT.list.txt"
    ],
	"options": [
    "-h", 
    "{INPUT}", 
    "{OUTPUT}"
    ],
	"input_option": {
    "base": "-",
    "arrangement": "'l'",
    },
	"output_option": {
    "base": "1",
    "extension": "SUF'.sam'",
    "arrangement": "'l'"
    },
	"output_files": {
    "base": "1",
    "extension": "SUF'.sam'",
    "arrangement": "'a'"
    }
}
```

**Command Generated**

```bash
samtools view -h test1.bam test1.sam
samtools view -h test2.bam test2.sam
samtools view -h test3.bam test3.sam
```

**Output Inputlist**

bam2sam.list.txt:

```
/home/bam2sam/test1.sam
/home/bam2sam/test2.sam
/home/bam2sam/test3.sam
```

***Case 2: Cuffdiff***

**Flielist**

INPUT.list.txt:

```
/home/cuffquant/ControlCr.rep1.cxb
/home/cuffquant/ControlCr.rep2.cxb
/home/cuffquant/ControlCr.rep3.cxb
/home/cuffquant/Cdx2koCr.rep1.cxb
/home/cuffquant/Cdx2koCr.rep2.cxb
/home/cuffquant/BrafHetCr.rep1.cxb
/home/cuffquant/BrafHetCr.rep2.cxb
/home/cuffquant/Cdx2BrafCr.rep1.cxb
/home/cuffquant/Cdx2BrafCr.rep2.cxb
/home/cuffquant/SmadBrafCr.rep1.cxb
```

**Tool Definition**

```json
{
  "name": "Cuffdiff",
  "description": "Summerize gene expression difference",
  "invoke": "cuffdiff",
  "inputlists": [
    "INPUT.list.txt"
    ],
  "options": [
    "{OUTPUT}",
    "{LABEL}",
    "--multi-read-correct",
    "-p 16",
    "--verbose",
    "--dispersion-method bind",
    "/mnt/input/statics/mm9/mm9_genes_archive_2014.gtf",
    "{INPUT}"
    ],
  "input_option": "{/Control/L|'c'A} {/Cdx2ko/L|'c'A} {/BrafHet/L|'c'A} {/Cdx2Braf/L|'c'A} {/SmadBraf/L|'c'A}",
  "output_option": "-o /mnt/working/cuffidff",
  "label_option": "-L {1,4,6,10L|1B|'c'A}",
  "output_files": [
    "/mnt/working/cuffdiff/gene_exp.diff"
    ]
}
```
**Command Generated**

```bash
cuffdiff -o /mnt/working/cuffidff \
  -L ControlCr,Cdx2koCr,BrafHetCr,Cdx2BrafCr,SmadBrafCr \
  --multi-read-correct \
  -p 16 \
  --verbose 
  --dispersion-method bind \
  /mnt/input/statics/mm9/mm9_genes_archive_2014.gtf \
  /home/cuffquant/ControlCr.rep1.cxb,/home/cuffquant/ControlCr.rep2.cxb,/home/cuffquant/ControlCr.rep3.cxb \
  /home/cuffquant/Cdx2koCr.rep1.cxb,/home/cuffquant/Cdx2koCr.rep2.cxb \
  /home/cuffquant/BrafHetCr.rep1.cxb,/home/cuffquant/BrafHetCr.rep2.cxb \
  /home/cuffquant/Cdx2BrafCr.rep1.cxb,/home/cuffquant/Cdx2BrafCr.rep2.cxb \
  /home/cuffquant/SmadBrafCr.rep1.cxb&
```

**Output Inputlist**

cuffdiff.list.txt:

```
/mnt/working/march2016/RNA/cuffdiff/result/gene_exp.diff
```
