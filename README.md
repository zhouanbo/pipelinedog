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
  - Indicator: indicates the start and end of an expression using double percentage sign (eg: %%).
  - Range: a range of numbers resembling that used in the linux cut command (eg: '1-5' or '2-' or '1,3,7'). The character '-' means to select all.
  - String: a singe quoted string (eg: '.bam' or '.vcf' or '-b')
  - Symbols: Other characters specifying the structure of the expression (eg: ':' or 'L' or 'E').

***Segments***

An *LEASH* expression consists of 5 segments. Segments are indicated by colons. The 5 segments in a LEASH expression are:

1. **Scope**: 
the first segment of the expression, specifying which Inputlist the expression should execute upon. This step pipes the *Inputlists* to the next segment. Scope is a *range* ending with a character 'F'. The numbers in the range refer to the index+1 of a *Inputlist* array.

2. **Selection**: 
a range ends with a character 'L', selecting what lines of inputs to be used in the Inputlist specified in *Scope*. This step pipes an array of inputs to the next segment. 

3. **Subtraction**: 
a segment that trims inputs from the *selection*. This step pipes an array of trimmed inputs to the next segment.
  - Starting with or without a character 'P' to indicate to include the entire file path or just the file names in the input.
  - Following that, a *Range* ending with the character 'B' is used to specify which (from right to left) base (parts of the file name separated by dots) of the file name to keep. For example, given the file name 'NA12877.sort.rmdup.chr20.bam', a *Reconstruction* segment of '2-4B' would return 'sort.rmdup.chr20'.

4. **Extension**
a segment that extends file paths from the *subtraction*. This step pipes an array of extended file names or path to the next segment.
A *String* was then given to specify the file extension to be added after the selected base names. A minus sign before the extension means adding it before the selected base names. A character 'E' is always followed.

5. **Arrangement (optional)**: 
leaded  by a *String* that indicates how to arrange the i from the inputs previous segments. After this segments, the return of the expression would become a string that available for the pipeline step to use.
  - if 'c' (comma) or 's' (spcae) is given, then all the inputs are separated by comma or space in between. 
  - if an option name (a string beginning with a dash) is given, then the return will begin with this option plus a space before each input. 
  - if 'l' is given, then the pipeline step will be looped through each of the input within the input expression and output expression. In this case, both of the *input_option* and *output_option*  and should be given 'l' as *Arrangement*. When giving 'l', only one expression inside *input_option* and *output_option* are allowed, and each *output_option* will be arranged according to each *input_option* (if *output_option* is more than *input_option*, the rest is ignored, if *output_option* is less than *input_option*, some of the run would have empty *output_option*).
  - if 'n' is given, no arrangement will be made, a string with paths directly next to each other will be returned.
  - if the *Arrangement* segment is omitted, an array of inputs prior to this segment will be returned. This array can be used as the value of the "output_file" key. 

***Step Definition***

A pipeline step is defined by a JSON object. Taking advantage of the JSON format, each step can be exported when the definition is finished and can be used again in the future. Also, different combinations of steps can be assembled to defined new pipelines.
```JSON
{
	"name": "bam2sam",
	"description": "convert bam files to sam files",
	"invoke": "samtools view",
	"inputlists": ["INPUT.list.txt"],
	"options": ["-h", "%INPUT%", "%OUTPUT%"],
	"input_option": "%1F:-L:-B:''E:'l'A%",
	"output_option": "%1F:-L:1B:'.sam'E:'l'A%",
	"output_files": "%1F:-L:1B:'.sam'E%"
}
```
The keys of the object are defined as following:

**name**: A string containing the name of the pipeline step.

**description**: A string that contains a functioanl description of what the step does.

**invoke**: The command to invoke the pipeline step.

**inputlists**: An array containing *Inputlists*, which is later selected by *LEASH* expressions.

**options**: An array of strings that correspond to each of the static input that is normally used in the pipeline step. The places that the dynamic inputs (input, output or label) come in should each be indicated by %INPUT%, %OUTPUT% and %LABEL%.

**input_option**: A string containing a *LEASH* expression that return the dynamic input option of the pipeline step. The %INPUT% placeholder in the option key will be replaced by the return of the *LEASH* expression.

**output_option**: A string containing a *LEASH* expression whose return will replace the %OUTPUT% placeholder in the option key. When the expression has 'l' as the arrangement method, the return should be the same length as the expression return in *input_option*. Sometimes the *output_option* can be a static input (eg: a pipeline step that needs a output folder and the folder needs be somewhere else than the default "project_folder/pipeline_step_name/" path), in which case a string can be used instead of an expression. 

**label_option**: A string containing a *LEASH* expression that could be used to replace %LABEL% placeholder in the option.

**output_files**: A array containing the actual output of the pipeline step. Notice the difference between *output_files* and *output_option*: *output_option* is required by the pipeline step, and is supplied to it directly; *output_option*, however, is required by PipelineDog and used to generate the *Inputlist* for the next pipeline step. In cases that files as the *output_option*, the two keys are relatively the same,  a removal of the *Arrangement* segment from *output_option* expression can return an array for *output_files*. In cases that folders as the *output_option*, one need to specify the files inside the folder that needed by next pipeline step to have them generated in the *Inputlist*.


## Use Cases

***Case 1: bam to sam***

**Inputlist**
INPUT.list.txt:
```
test1.bam
test2.bam
test3.bam
```
**Tool definition**
```JSON
{
	"name": "bam2sam",
	"description": "convert bam files to sam files",
	"invoke": "samtools view",
	"inputlists": ["INPUT.list.txt"],
	"options": ["-h", "%INPUT%", "%OUTPUT%"],
	"input_option": "%1F:-L:-B:''E:'l'A%",
	"output_option": "%1F:-L:1B:'.sam'E:'l'A%",
	"output_files": [“%1F:-L:P1B:'.sam’E%”]
}
```
**Command Generated**
```bash
samtools view -h test1.bam test1.sam
samtools view -h test2.bam test2.sam
samtools view -h test3.bam test3.sam
```
**Output Inputlist**
bam2sam.txt:
```
bam2sam/test1.sam
bam2sam/test2.sam
bam2sam/test3.sam
```

***Case 2: Cuffdiff (Advanced)***

**Flielist**
INPUT.list.txt:
```
/home/cuffquant/ControlCr.Rep1.cxb
/home/cuffquant/ControlCr.Rep2.cxb 
/home/cuffquant/ControlCr.Rep3.cxb
/home/cuffquant/Cdx2koCr.rep1.cxb
/home/cuffquant/Cdx2koCr.rep2.cxb
/home/cuffquant/BrafHetCr.ATCACG.cxb
/home/cuffquant/BrafHetCr.GATCAG.cxb
/home/cuffquant/Cdx2BrafHetCr.TAGCTT.cxb
/home/cuffquant/Cdx2BrafHetCr.TTAGGC.cxb
/home/cuffquant/smadBrafHetCr.ACTTGA.cxb
```

**Tool Definition**
```JSON
{
  "name": "Cuffdiff",
  "description": "Summerize gene expression difference",
  "invoke": "cuffdiff",
  "inputlists": [
    "/Users/zhouanbo/ElectronProjects/pipelinedog/examples/cuffdiff/INPUT.list.txt"
  ],
  "options": [
    "%OUTPUT%",
    "%LABEL%",
    "--multi-read-correct",
    "-p 16",
    "--verbose",
    "--dispersion-method bind",
    "/mnt/input/statics/mm9/mm9_genes_archive_2014.gtf",
    "%INPUT%"
  ],
  "input_option": "%1F:1-3L:P-B:''E:'c'A% %1F:4,5L:P-B:''E:'c'A% %1F:6,7L:P-B:''E:'c'A% %1F:8,9L:P-B:''E:'c'A% %1F:10L:P-B:''E:'c'A%",
  "output_option": "-o /mnt/working/cuffidff",
  "label_option": "-L %1F:1,4,6,10L:1B:''E:'c'A%",
  "output_files": [
    "/mnt/working/cuffdiff/gene_exp.diff"
  ]
}
```
**Command Generated**
```bash
cuffdiff -o /mnt/working/march2016/RNA/cuffdiff/result -L ControlCr,Cdx2koCr,BrafHetCr,Cdx2BrafHetCr,smadBrafHetCr --multi-read-correct -p 16 --verbose --dispersion-method blind /mnt/input/statics/mm9/mm9_genes_archive_2014.gtf /home/cuffquant/ControlCr.Rep1.cxb,/home/cuffquant/ControlCr.Rep2.cxb,/home/cuffquant/ControlCr.Rep3.cxb /home/cuffquant/Cdx2koCr.rep1.cxb,/home/cuffquant/Cdx2koCr.rep2.cxb /home/cuffquant/BrafHetCr.ATCACG.cxb,/home/cuffquant/BrafHetCr.GATCAG.cxb /home/cuffquant/Cdx2BrafHetCr.TAGCTT.cxb,/home/cuffquant/Cdx2BrafHetCr.TTAGGC.cxb /home/cuffquant/smadBrafHetCr.ACTTGA.cxb
```
**Output Inputlist**
cuffdiff.txt:
```
/mnt/working/march2016/RNA/cuffdiff/result/gene_exp.diff
```
