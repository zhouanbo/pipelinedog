![PipelineDog Logo](http://pipeline.dog/icon.png)
# PiplineDog Docs

This is the documentation of PipelineDog, a tool that helps you better construct and maintain your scientific pipelines.


## Concepts

***Filelist***
A list of file paths with each file path per line. This is the input of the entire pipeline, as well as the input of each pipeline step, and it's also what the LEASH expression is executed upon. Initially there's a default FILELIST.txt as a input of the entire pipeline. *Filelists* are the basic units of pipeline step communication, and the major behaviors of PipelineDog are about parsing, processing and generating *Filelists*.

***Dynamic inputs and static inputs***
Inputs are categorized into dynamic inputs and static inputs. Dynamic inputs are different in each run of the pipeline (eg: bam files). Static inputs remain the same each run (eg: reference files or "--cpu-cores 8"). Static inputs can be specified directly as how one would normally run a program. However, dynamic inputs need processing before it can be used as the input for a pipeline step since extra flexibility are required.

***Hierarchy***
The input and output of a pipeline step are both *Filelists*, so that upstream and downstream pipeline step can be connected. Downstream pipeline steps are at lower hierarchy than the upstream steps. Lower hierarchy steps can only see the output of higher hierarchy steps to avoid truncated inputs, and steps at the highest hierarchy can only use the initial FILELIST.txt specified by PipelineDog.

***LEASH***
A expression system that describe the conversion from a *Filelist* to a pipeline step's dynamic input. It is an acronym for "Little Embarrassed About Such Humor". Not really.

***Elements***
The components that used to assemble a *LEASH* expression, including:
- Indicator: indicates the start and end of an expression using double percentage sign (eg: %%).
- Range: a range of numbers resembling that used in the linux cut command (eg: 1-5 or 1,3,7). The value 0 means to select all.
- String: a singe quoted string (eg: '.bam' or '.vcf' or '-b')
- Symbols: Other characters specifying the structure of the expression (eg: ':' or 'L' or 'E').

***Segments***
An *LEASH* expression consists of 4 segments. Segments are indicated by colons. The 4 segments in a LEASH expression are:

1. **Scope (optional)**: 
the first segment of the expression, specifying which Filelist the expression should execute upon. This step pipes the Filelists to the next segment. Scope is a *range* ending with a character 'F'. The numbers in the range refer to the index+1 of a Filelist array. If there's only one *Filelist* in the array, then *Scope* can be omitted, and the default value '1F' will be used.

2. **Selection (optional)**: 
a range ends with a character 'L', selecting what lines of file paths to be used in the Filelist specified in *Scope*. This step pipes an array of file paths to the next segment. If omitted, the value '0L' will be used to select all lines.

3. **Reconstruction (optional)**: 
a segment that trims file paths from the *selection*. This step pipes an array of trimmed file names or path to the next segment.
- Starting with or without a character 'P' to indicate to include the entire file path or just the file names. 
- Following that, a *Range* ending with the character 'B' is used to specify which (from right to left) base (parts of the file name separated by dots) of the file name to keep. If a minus sign is added before the number, it then means removing that base from right to left. For example, given the file name 'NA12877.sort.rmdup.chr20.bam', a *Reconstruction* segment of '2-4B' would return 'sort.rmdup.chr20', and a '-1B' segment will result in 'NA12877.sort.rmdup.chr20'.
- After specifying the base name, a *String* was then given to specify the file extension to be added after the selected base names. A character 'E' is followed.
- If the *Reconstruction* segment is omitted,  a default value of 'P0B' will be used to return the entire file path.

4. **Arrangement (optional)**: 
leaded  by a *String* that indicates how to arrange the file names from the previous segments. After this segments, the return of the expression would become a string that available for the pipeline step to use.
- if 'c' (comma) or 's' (spcae) is given, then all the file names or paths are separated by comma or space in between. 
- if an option name (a string beginning with a dash) is given, then the return will begin with this option plus a space before each file name or path. 
- if 'l' is given, then the pipeline step will be looped through each of the files within the input expression and output expression. It should only be used on pipeline steps that take only one dynamic input file per run.
- if 'n' is given, no arrangement will be made, a string with paths directly next to each other will be returned.
- if the *Arrangement* segment is omitted, an array of file names or paths prior to this segment will be returned. This array can be used as the value of the "output_file" key. 

***Step Definition***

A pipeline step is defined by a JSON object. Taking advantage of the JSON format, each step can be exported when the definition is finished and can be used again in the future. Also, different combinations of steps can be assembled to defined new pipelines.
```JSON
{
	"name": "bam2sam",
	"description": "convert bam files to sam files",
	"invoke": "samtools view",
	"filelists": ["FILELIST.txt"],
	"options": ["-h", "%INPUT%", "%OUTPUT%"],
	"input_option": "%1F:0L:0B:'l'A%",
	"output_option": "%1F:0L:-1B'.sam'E:'l'A%",
	"output_files": "%1F:0L:-1B'.sam'E%"
}
```
The keys of the object are defined as following:

**name**: A string containing the name of the pipeline step.

**description**: A string that contains a functioanl description of what the step does.

**invoke**: The command to invoke the pipeline step.

**filelists**: An array containing *Filelists*, which is later selected by *LEASH* expressions.

**options**: An array of strings that correspond to each of the static input that is normally used in the pipeline step. The places that the dynamic inputs (input, output or label) come in should each be indicated by %INPUT%, %OUTPUT% and %LABEL%.

**input_option**: A string containing a *LEASH* expression that return the dynamic input option of the pipeline step. The %INPUT% placeholder in the option key will be replaced by the return of the *LEASH* expression.

**output_option**: A string containing a *LEASH* expression whose return will replace the %OUTPUT% placeholder in the option key. When the expression has 'l' as the arrangement method, the return should be the same length as the expression return in *input_option*. Sometimes the *output_option* can be a static input (eg: a pipeline step that needs a output folder and the folder needs be somewhere else than the default "project_folder/pipeline_step_name/" path), in which case a string can be used instead of an expression. 

**label_option**: A string containing a *LEASH* expression that could be used to replace %LABEL% placeholder in the option.

**output_files**: A array containing the actually output of the pipeline step. Notice the difference between *output_files* and *output_option*: *output_option* is required by the pipeline step, and is supplied to it directly; *output_option*, however, is required by PipelineDog and used to generate the *Filelist* for the next pipeline step. In cases that files as the *output_option*, the two keys are relatively the same,  a removal of the *Arrangement* segment from *output_option* expression can return an array for *output_files*. In cases that folders as the *output_option*, one need to specify the files inside the folder that needed by next pipeline step to have them generated in the *Filelist*.


## Use Cases

***Case 1: bam to sam***

**Filelist**
FILELIST.txt:
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
	"filelists": ["FILELIST.txt"],
	"options": ["-h", "%INPUT%", "%OUTPUT%"],
	"input_option": "%1F:0L:0B:'l'A%",
	"output_option": "%1F:0L:-1B'.sam'E:'l'A%",
	"output_files": "%1F:0L:-1B'.sam'E%"
}
```
**Command Generated**
```bash
samtools view -h test1.bam test1.sam
samtools view -h test2.bam test2.sam
samtools view -h test3.bam test3.sam
```
**Output Filelist**
bam2sam.txt:
```
bam2sam/test1.sam
bam2sam/test2.sam
bam2sam/test3.sam
```

***Case 2: Cuffdiff (Advanced)***

**Flielist**
FILELIST.txt:
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
	"name": "cuffdiff",
	"description": "summarize gene expression difference between experimental groups",
	"invoke": "cuffdiff",
	"filelists": ["FILELIST.txt"],
	"options": [
		"%OUTPUT%", 
		"%LABEL%",
		"--multi-read-correct",
		"-p 16",
		"--verbose",
		"--dispersion-method blind",
		"/mnt/input/statics/mm9/mm9_genes_archive_2014.gtf",
		"%INPUT%"	
],
	"input_option": "%1F:P1-3L:0B:'c'A% %1F:P4,5L:0B:'c'A% %1F:P6,7L:0B:'c'A% %1F:P8,9L:0B:'c'A% %1F:P10L:0B:'c'A%",
	"output_option": "-o /mnt/working/march2016/RNA/cuffdiff/result/",
	"label_option": "-L %1F:1L:-3B:'n'A%,%1F:4L:-3B:'n'A%,%1F:6L:-3B:'n'A%,%1F:8L:-3B:'n'A%,%1F:10L:-3B:'n'A%",
	"output_files": ["/mnt/working/march2016/RNA/cuffdiff/result/gene_exp.diff"]
}
```
**Command Generated**
```bash
cuffdiff \
-o /mnt/working/march2016/RNA/cuffdiff/result \
-L ControlCr,Cdx2koCr,BrafHetCr,Cdx2BrafHetCr,smadBrafHetCr \
--multi-read-correct \
-p 16 \
--verbose \
--dispersion-method blind \
/mnt/input/statics/mm9/mm9_genes_archive_2014.gtf \
/home/cuffquant/ControlCr.Rep1.cxb,/home/cuffquant/ControlCr.Rep2.cxb,/home/cuffquant/ControlCr.Rep3.cxb \
/home/cuffquant/Cdx2koCr.rep1.cxb,/home/cuffquant/Cdx2koCr.rep2.cxb \
/home/cuffquant/BrafHetCr.ATCACG.cxb,/home/cuffquant/BrafHetCr.GATCAG.cxb \
/home/cuffquant/Cdx2BrafHetCr.TAGCTT.cxb,/home/cuffquant/Cdx2BrafHetCr.TTAGGC.cxb \
/home/cuffquant/smadBrafHetCr.ACTTGA.cxb
```
**Output Filelist**
cuffdiff.txt:
```
/mnt/working/march2016/RNA/cuffdiff/result/gene_exp.diff
```
